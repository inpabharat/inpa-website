import { desc, eq } from 'drizzle-orm'
import type {
  PublicationInput,
  PublicationRecord,
  PublicPublication,
  PublicResearch,
  ResearchInput,
  ResearchRecord,
  ScienceMediaUsage,
} from '../../shared/types/science'
import type { InpaDatabase } from '../database/client'
import { contentRevisions, featuredResearch, publications } from '../database/schema'

type ScienceEntity = 'publication' | 'research'
type RevisionAction = 'create' | 'update' | 'delete'

const baselinePublications: PublicationRecord[] = [
  {
    id: 'nuclear-horizons-1-1',
    slug: 'nuclear-horizons-volume-1-issue-1',
    title: 'Nuclear Horizons',
    volume: 1,
    issueNumber: 1,
    issueLabel: 'Volume 1, Issue 1 (Inaugural Issue)',
    publicationDate: '2026-01-01',
    summary: '',
    editorial: '',
    featuredReview: '',
    pdfKey: '/publications/nuclear-horizons-volume-1-issue-1.pdf',
    coverImageKey: '/images/publications/nuclear-horizons-volume-1-issue-1.jpg',
    coverImageAlt: 'Cover of Nuclear Horizons, Volume 1, Issue 1',
    pageCount: 80,
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'repository-baseline',
    updatedBy: 'repository-baseline',
  },
  {
    id: 'nuclear-horizons-1-2',
    slug: 'nuclear-horizons-volume-1-issue-2',
    title: 'Nuclear Horizons',
    volume: 1,
    issueNumber: 2,
    issueLabel: 'Volume 1, Issue 2',
    publicationDate: '2026-06-01',
    summary: '',
    editorial: '',
    featuredReview: '',
    pdfKey: '/publications/nuclear-horizons-volume-1-issue-2.pdf',
    coverImageKey: '/images/publications/nuclear-horizons-volume-1-issue-2.jpg',
    coverImageAlt: 'Cover of Nuclear Horizons, Volume 1, Issue 2',
    pageCount: 81,
    status: 'published',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    createdBy: 'repository-baseline',
    updatedBy: 'repository-baseline',
  },
]

export const staticPublicationMedia = new Map([
  ['/publications/nuclear-horizons-volume-1-issue-1.pdf', 'application/pdf'],
  ['/publications/nuclear-horizons-volume-1-issue-2.pdf', 'application/pdf'],
  ['/images/publications/nuclear-horizons-volume-1-issue-1.jpg', 'image/jpeg'],
  ['/images/publications/nuclear-horizons-volume-1-issue-2.jpg', 'image/jpeg'],
] as const)

function revision(
  entityType: ScienceEntity,
  entityId: string,
  action: RevisionAction,
  editorIdentity: string,
  previousValue: unknown,
  newValue: unknown,
  createdAt: string,
) {
  return {
    id: crypto.randomUUID(),
    entityType,
    entityId,
    action,
    editorIdentity,
    previousValue: previousValue === null ? null : JSON.stringify(previousValue),
    newValue: newValue === null ? null : JSON.stringify(newValue),
    createdAt,
  }
}

function publicPublication(record: PublicationRecord): PublicPublication {
  const { createdAt: _createdAt, updatedAt: _updatedAt, createdBy: _createdBy, updatedBy: _updatedBy, ...item } = record
  return item
}

function publicResearch(record: ResearchRecord): PublicResearch {
  const { createdAt: _createdAt, updatedAt: _updatedAt, createdBy: _createdBy, updatedBy: _updatedBy, ...item } = record
  return item
}

function publicationSort(a: PublicationRecord, b: PublicationRecord): number {
  return b.publicationDate.localeCompare(a.publicationDate) || b.volume - a.volume || b.issueNumber - a.issueNumber
}

function researchSort(a: ResearchRecord, b: ResearchRecord): number {
  return Number(b.isFeatured) - Number(a.isFeatured) || b.publishedAt.localeCompare(a.publishedAt) || b.updatedAt.localeCompare(a.updatedAt)
}

export class ScienceRepository {
  constructor(private readonly database: InpaDatabase) {}

  async listPublications(): Promise<PublicationRecord[]> {
    const rows = await this.database.select().from(publications).orderBy(desc(publications.publicationDate))
    const merged = new Map(baselinePublications.map(item => [item.id, item]))
    for (const row of rows) merged.set(row.id, row)
    return [...merged.values()].sort(publicationSort)
  }

  async listResearch(): Promise<ResearchRecord[]> {
    const rows = await this.database.select().from(featuredResearch).orderBy(desc(featuredResearch.updatedAt))
    return rows.sort(researchSort)
  }

  async listPublishedPublications(today: string): Promise<PublicPublication[]> {
    const records = await this.listPublications()
    return records
      .filter(item => item.status === 'published' && item.publicationDate <= today)
      .map(publicPublication)
  }

  async listPublishedResearch(today: string): Promise<PublicResearch[]> {
    const records = await this.listResearch()
    return records
      .filter(item => item.status === 'published' && item.publishedAt <= today)
      .map(publicResearch)
  }

  async getPublishedResearchBySlug(slug: string, today: string): Promise<PublicResearch | null> {
    const row = await this.database.query.featuredResearch.findFirst({ where: eq(featuredResearch.slug, slug) })
    if (!row || row.status !== 'published' || row.publishedAt > today) return null
    return publicResearch(row)
  }

  private async assertPublicationUnique(input: PublicationInput, exceptId?: string): Promise<void> {
    const conflict = (await this.listPublications()).find(item => item.id !== exceptId && (
      item.slug === input.slug || (item.volume === input.volume && item.issueNumber === input.issueNumber)
    ))
    if (!conflict) return
    if (conflict.slug === input.slug) throw new Error('UNIQUE constraint failed: publications.slug')
    throw new Error('UNIQUE constraint failed: publications.volume, publications.issue_number')
  }

  async createPublication(input: PublicationInput, editor: string): Promise<PublicationRecord> {
    await this.assertPublicationUnique(input)
    const now = new Date().toISOString()
    const row: PublicationRecord = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
      createdBy: editor,
      updatedBy: editor,
    }
    await this.database.batch([
      this.database.insert(publications).values(row),
      this.database.insert(contentRevisions).values(revision('publication', row.id, 'create', editor, null, row, now)),
    ])
    return row
  }

  async updatePublication(id: string, input: PublicationInput, editor: string): Promise<PublicationRecord | null> {
    const stored = await this.database.query.publications.findFirst({ where: eq(publications.id, id) })
    const previous = stored ?? baselinePublications.find(item => item.id === id)
    if (!previous) return null
    await this.assertPublicationUnique(input, id)
    const now = new Date().toISOString()
    const next: PublicationRecord = {
      ...previous,
      ...input,
      updatedAt: now,
      updatedBy: editor,
    }
    await this.database.batch([
      stored
        ? this.database.update(publications).set({ ...input, updatedAt: now, updatedBy: editor }).where(eq(publications.id, id))
        : this.database.insert(publications).values(next),
      this.database.insert(contentRevisions).values(revision('publication', id, 'update', editor, previous, next, now)),
    ])
    return next
  }

  async deletePublication(id: string, editor: string): Promise<boolean> {
    const stored = await this.database.query.publications.findFirst({ where: eq(publications.id, id) })
    const baseline = baselinePublications.find(item => item.id === id)
    const previous = stored ?? baseline
    if (!previous) return false
    const now = new Date().toISOString()
    if (baseline) {
      const tombstone: PublicationRecord = {
        ...previous,
        status: 'archived',
        updatedAt: now,
        updatedBy: editor,
      }
      await this.database.batch([
        stored
          ? this.database.update(publications).set({ status: 'archived', updatedAt: now, updatedBy: editor }).where(eq(publications.id, id))
          : this.database.insert(publications).values(tombstone),
        this.database.insert(contentRevisions).values(revision('publication', id, 'delete', editor, previous, tombstone, now)),
      ])
      return true
    }
    await this.database.batch([
      this.database.delete(publications).where(eq(publications.id, id)),
      this.database.insert(contentRevisions).values(revision('publication', id, 'delete', editor, previous, null, now)),
    ])
    return true
  }

  async createResearch(input: ResearchInput, editor: string): Promise<ResearchRecord> {
    const now = new Date().toISOString()
    const row: ResearchRecord = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
      createdBy: editor,
      updatedBy: editor,
    }
    await this.database.batch([
      this.database.insert(featuredResearch).values(row),
      this.database.insert(contentRevisions).values(revision('research', row.id, 'create', editor, null, row, now)),
    ])
    return row
  }

  async updateResearch(id: string, input: ResearchInput, editor: string): Promise<ResearchRecord | null> {
    const previous = await this.database.query.featuredResearch.findFirst({ where: eq(featuredResearch.id, id) })
    if (!previous) return null
    const now = new Date().toISOString()
    const next: ResearchRecord = { ...previous, ...input, updatedAt: now, updatedBy: editor }
    await this.database.batch([
      this.database.update(featuredResearch).set({ ...input, updatedAt: now, updatedBy: editor }).where(eq(featuredResearch.id, id)),
      this.database.insert(contentRevisions).values(revision('research', id, 'update', editor, previous, next, now)),
    ])
    return next
  }

  async deleteResearch(id: string, editor: string): Promise<boolean> {
    const previous = await this.database.query.featuredResearch.findFirst({ where: eq(featuredResearch.id, id) })
    if (!previous) return false
    const now = new Date().toISOString()
    await this.database.batch([
      this.database.delete(featuredResearch).where(eq(featuredResearch.id, id)),
      this.database.insert(contentRevisions).values(revision('research', id, 'delete', editor, previous, null, now)),
    ])
    return true
  }

  async mediaReferences(key: string): Promise<ScienceMediaUsage[]> {
    const [publicationRows, researchRows] = await Promise.all([this.listPublications(), this.listResearch()])
    return [
      ...publicationRows
        .filter(item => item.pdfKey === key || item.coverImageKey === key)
        .map(item => ({ kind: 'publication' as const, id: item.id, title: item.issueLabel || item.title, status: item.status })),
      ...researchRows
        .filter(item => item.imageKey === key)
        .map(item => ({ kind: 'research' as const, id: item.id, title: item.title, status: item.status })),
    ]
  }
}
