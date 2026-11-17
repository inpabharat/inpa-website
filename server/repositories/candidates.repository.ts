import { and, desc, eq, gt, isNotNull, isNull, lte, or, sql } from 'drizzle-orm'
import { candidateRetention } from '../../shared/types/candidates'
import type { CandidateDirectory, CandidateProfile, CandidateReview, CandidateRole, CandidateState } from '../../shared/types/candidates'
import type { InpaDatabase } from '../database/client'
import { academicCandidates as candidates } from '../database/schema'

const publicFields = {
  name: candidates.name,
  affiliation: candidates.affiliation,
  stage: candidates.stage,
  roles: candidates.roles,
  research: candidates.research,
  availability: candidates.availability,
  summary: candidates.summary,
  cvUrl: candidates.cvUrl,
}

const stateFields = {
  ...publicFields,
  verifiedAt: candidates.verifiedAt,
  expiresAt: candidates.expiresAt,
  renewalRequestedAt: candidates.renewalRequestedAt,
}

const pageSize = 20
const timestamp = (now: string, days: number) => new Date(Date.parse(now) + days * 86_400_000).toISOString()

function toState(row: CandidateProfile & { verifiedAt: string | null, expiresAt: string | null, renewalRequestedAt: string | null }, now: string): CandidateState {
  const { verifiedAt, expiresAt, renewalRequestedAt, ...profile } = row
  return {
    profile,
    status: !verifiedAt ? 'unverified' : !expiresAt ? 'review' : expiresAt > now ? 'published' : 'expired',
    expiresAt,
    renewalRequested: Boolean(renewalRequestedAt),
    canRequestRenewal: Boolean(verifiedAt && expiresAt && !renewalRequestedAt && expiresAt <= timestamp(now, candidateRetention.renewalWindowDays)),
  }
}

export class CandidatesRepository {
  constructor(private readonly database: InpaDatabase) {}

  async directory(now: string, page: number, term: string, role?: CandidateRole): Promise<CandidateDirectory> {
    const pattern = '%' + term.replaceAll('\\', '\\\\').replaceAll('%', '\\%').replaceAll('_', '\\_') + '%'
    const rows = await this.database.select(publicFields).from(candidates)
      .where(and(
        isNotNull(candidates.verifiedAt),
        gt(candidates.expiresAt, now),
        term ? or(
          sql`${candidates.name} like ${pattern} escape '\\'`,
          sql`${candidates.research} like ${pattern} escape '\\'`,
          sql`${candidates.affiliation} like ${pattern} escape '\\'`,
        ) : undefined,
        role ? sql`exists (select 1 from json_each(${candidates.roles}) where value = ${role})` : undefined,
      ))
      .orderBy(desc(candidates.expiresAt), desc(candidates.id))
      .limit(pageSize + 1).offset((page - 1) * pageSize)
    return { profiles: rows.slice(0, pageSize), hasNext: rows.length > pageSize }
  }

  async submit(profile: CandidateProfile, email: string, now: string): Promise<void> {
    await this.database.insert(candidates).values({
      ...profile, id: crypto.randomUUID(), email, createdAt: now, consentAt: now,
      deleteAfter: timestamp(now, candidateRetention.unverifiedDays),
    }).onConflictDoNothing({ target: candidates.email })
  }

  async reviewQueue(now: string, page: number): Promise<{ profiles: CandidateReview[], hasNext: boolean }> {
    const rows = await this.database.select({
      ...stateFields, id: candidates.id, email: candidates.email, createdAt: candidates.createdAt,
      linkIssued: sql<boolean>`case when ${candidates.tokenHash} is not null and
        (${candidates.verifiedAt} is not null or ${candidates.linkExpiresAt} > ${now}) then 1 else 0 end`,
    }).from(candidates).where(gt(candidates.deleteAfter, now))
      .orderBy(sql`case
        when ${candidates.renewalRequestedAt} is not null or (${candidates.verifiedAt} is not null and ${candidates.expiresAt} is null) then 0
        when ${candidates.verifiedAt} is null then 1
        else 2 end`, desc(candidates.createdAt), desc(candidates.id))
      .limit(pageSize + 1).offset((page - 1) * pageSize)
    return {
      profiles: rows.slice(0, pageSize).map(({ id, email, createdAt, linkIssued, ...row }) => ({
        ...toState(row, now), id, email, createdAt, linkIssued: Boolean(linkIssued),
      })),
      hasNext: rows.length > pageSize,
    }
  }

  async issueLink(id: string, tokenHash: string, now: string) {
    const [row] = await this.database.update(candidates)
      .set({ tokenHash, linkExpiresAt: timestamp(now, candidateRetention.linkDays) })
      .where(and(eq(candidates.id, id), gt(candidates.deleteAfter, now)))
      .returning({ email: candidates.email, verified: candidates.verifiedAt })
    return row
  }

  async publish(id: string, now: string): Promise<boolean> {
    const [row] = await this.database.update(candidates).set({
      expiresAt: timestamp(now, candidateRetention.listingDays),
      deleteAfter: timestamp(now, candidateRetention.listingDays + candidateRetention.reviewDays),
      renewalRequestedAt: null,
    }).where(and(
      eq(candidates.id, id), gt(candidates.deleteAfter, now), isNotNull(candidates.verifiedAt),
      or(isNull(candidates.expiresAt), isNotNull(candidates.renewalRequestedAt)),
    )).returning({ id: candidates.id })
    return Boolean(row)
  }

  private validLink(tokenHash: string, now: string) {
    return and(eq(candidates.tokenHash, tokenHash), gt(candidates.deleteAfter, now),
      or(isNotNull(candidates.verifiedAt), gt(candidates.linkExpiresAt, now)))
  }

  async manage(tokenHash: string, now: string): Promise<CandidateState | null> {
    const [row] = await this.database.select(stateFields).from(candidates)
      .where(this.validLink(tokenHash, now)).limit(1)
    return row ? toState(row, now) : null
  }

  async verify(tokenHash: string, now: string): Promise<void> {
    await this.database.update(candidates)
      .set({ verifiedAt: now, deleteAfter: timestamp(now, candidateRetention.reviewDays) })
      .where(and(this.validLink(tokenHash, now), isNull(candidates.verifiedAt)))
  }

  async renew(tokenHash: string, now: string): Promise<void> {
    await this.database.update(candidates).set({
      renewalRequestedAt: now,
      deleteAfter: sql`max(${candidates.deleteAfter}, ${timestamp(now, candidateRetention.reviewDays)})`,
    }).where(and(
      this.validLink(tokenHash, now), isNotNull(candidates.verifiedAt),
      lte(candidates.expiresAt, timestamp(now, candidateRetention.renewalWindowDays)),
      isNull(candidates.renewalRequestedAt),
    ))
  }

  async withdraw(tokenHash: string, now: string): Promise<boolean> {
    const [row] = await this.database.delete(candidates).where(this.validLink(tokenHash, now)).returning({ id: candidates.id })
    return Boolean(row)
  }

  async remove(id: string): Promise<void> {
    await this.database.delete(candidates).where(eq(candidates.id, id))
  }

  async purge(now: string): Promise<void> {
    await this.database.delete(candidates).where(lte(candidates.deleteAfter, now))
  }
}
