import { and, asc, desc, eq, gt, gte, inArray, isNull, lte, or } from 'drizzle-orm'
import type { InpaDatabase } from '../database/client'
import { carouselItems, events, news } from '../database/schema'

export class PublicContentRepository {
  constructor(private readonly database: InpaDatabase) {}

  listLatestNews(now: string, limit = 3) {
    return this.database
      .select({
        slug: news.slug,
        title: news.title,
        summary: news.summary,
        publishedAt: news.publishedAt,
        category: news.category,
        coverImageKey: news.coverImageKey,
        coverImageAlt: news.coverImageAlt,
        externalUrl: news.externalUrl,
      })
      .from(news)
      .where(
        and(
          eq(news.status, 'published'),
          lte(news.publishedAt, now),
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
        eq(news.status, 'published'),
        lte(news.publishedAt, now),
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
      })
      .from(events)
      .where(
        and(
          inArray(events.status, ['published', 'postponed', 'cancelled']),
          or(isNull(events.publishAt), lte(events.publishAt, now)),
          gte(events.startAt, now),
        ),
      )
      .orderBy(asc(events.startAt))
      .limit(limit)
  }

  getEventBySlug(slug: string, now: string) {
    return this.database.query.events.findFirst({
      where: and(
        eq(events.slug, slug),
        inArray(events.status, ['published', 'postponed', 'cancelled', 'completed']),
        or(isNull(events.publishAt), lte(events.publishAt, now)),
      ),
    })
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
