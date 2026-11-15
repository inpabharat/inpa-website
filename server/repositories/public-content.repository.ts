import { and, asc, desc, eq, gt, gte, inArray, isNull, lt, lte, or, sql } from 'drizzle-orm'
import type { InpaDatabase } from '../database/client'
import { carouselItems, events, news } from '../database/schema'

function publicEvent(now: string, includeCompleted = true) {
  return or(
    inArray(events.status, includeCompleted
      ? ['published', 'postponed', 'cancelled', 'completed']
      : ['published', 'postponed', 'cancelled']),
    and(eq(events.status, 'scheduled'), or(isNull(events.publishAt), lte(events.publishAt, now))),
  )
}

const eventArchiveAt = sql<string>`case when ${events.eventType} = 'colloquium'
  then coalesce(${events.endAt}, ${events.startAt}) else ${events.startAt} end`

export class PublicContentRepository {
  constructor(private readonly database: InpaDatabase) {}

  listLatestNews(now: string, limit = 3) {
    return this.database
      .select({
        slug: news.slug,
        title: news.title,
        summary: news.summary,
        publishedAt: news.publishedAt,
        publishAt: news.publishAt,
        category: news.category,
        coverImageKey: news.coverImageKey,
        coverImageAlt: news.coverImageAlt,
        externalUrl: news.externalUrl,
      })
      .from(news)
      .where(
        and(
          or(
            and(eq(news.status, 'published'), lte(news.publishedAt, now)),
            and(eq(news.status, 'scheduled'), lte(news.publishAt, now)),
          ),
          or(isNull(news.expiresAt), gt(news.expiresAt, now)),
        ),
      )
      .orderBy(desc(news.publishedAt))
      .limit(limit)
  }

  getNewsBySlug(slug: string, now: string) {
    return this.database.query.news.findFirst({
      where: and(
        eq(news.slug, slug),
        or(
          and(eq(news.status, 'published'), lte(news.publishedAt, now)),
          and(eq(news.status, 'scheduled'), lte(news.publishAt, now)),
        ),
        or(isNull(news.expiresAt), gt(news.expiresAt, now)),
      ),
    })
  }

  listUpcomingEvents(now: string, limit = 4) {
    return this.database
      .select({
        slug: events.slug,
        title: events.title,
        summary: events.summary,
        startAt: events.startAt,
        endAt: events.endAt,
        timezone: events.timezone,
        locationName: events.locationName,
        isOnline: events.isOnline,
        status: events.status,
        externalUrl: events.externalUrl,
        coverImageKey: events.coverImageKey,
        coverImageAlt: events.coverImageAlt,
      })
      .from(events)
      .where(and(publicEvent(now, false), gte(eventArchiveAt, now)))
      .orderBy(asc(events.startAt))
      .limit(limit)
  }

  listPastEvents(now: string, limit = 50) {
    return this.database
      .select({
        slug: events.slug,
        title: events.title,
        summary: events.summary,
        startAt: events.startAt,
        endAt: events.endAt,
        timezone: events.timezone,
        locationName: events.locationName,
        isOnline: events.isOnline,
        status: events.status,
        externalUrl: events.externalUrl,
        coverImageKey: events.coverImageKey,
        coverImageAlt: events.coverImageAlt,
      })
      .from(events)
      .where(and(publicEvent(now), or(
        lt(eventArchiveAt, now),
        and(eq(events.eventType, 'colloquium'), eq(events.status, 'completed')),
      )))
      .orderBy(desc(events.startAt))
      .limit(limit)
  }

  getEventBySlug(slug: string, now: string) {
    return this.database.query.events.findFirst({
      where: and(eq(events.slug, slug), publicEvent(now)),
    })
  }

  listColloquiumEvents(now: string) {
    return this.database
      .select({
        slug: events.slug,
        title: events.title,
        startAt: events.startAt,
        endAt: events.endAt,
        timezone: events.timezone,
        speaker: events.speaker,
        speakerAffiliation: events.speakerAffiliation,
        seminarLabel: events.seminarLabel,
        posterPdfKey: events.posterPdfKey,
        status: events.status,
      })
      .from(events)
      .where(and(eq(events.eventType, 'colloquium'), publicEvent(now)))
      .orderBy(asc(events.startAt), asc(events.slug))
  }

  listActiveCarouselItems(now: string) {
    return this.database
      .select({
        id: carouselItems.id,
        eyebrow: carouselItems.eyebrow,
        title: carouselItems.title,
        summary: carouselItems.summary,
        imageKey: carouselItems.imageKey,
        imageAlt: carouselItems.imageAlt,
        ctaLabel: carouselItems.ctaLabel,
        ctaUrl: carouselItems.ctaUrl,
        sortOrder: carouselItems.sortOrder,
      })
      .from(carouselItems)
      .where(
        and(
          eq(carouselItems.isActive, true),
          or(isNull(carouselItems.startsAt), lte(carouselItems.startsAt, now)),
          or(isNull(carouselItems.endsAt), gt(carouselItems.endsAt, now)),
        ),
      )
      .orderBy(asc(carouselItems.sortOrder))
  }
}
