import { asc, count, desc, eq } from 'drizzle-orm'
import type { AdminCarouselInput, AdminContentSnapshot, AdminEventInput, AdminNewsInput } from '../../shared/types/admin'
import type { InpaDatabase } from '../database/client'
import { carouselItems, contentRevisions, events, news } from '../database/schema'

type EntityType = 'news' | 'event' | 'carousel' | 'media'
type RevisionAction = 'create' | 'update' | 'delete'

function revision(
  entityType: EntityType,
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

export class AdminContentRepository {
  constructor(private readonly database: InpaDatabase) {}

  async snapshot(): Promise<AdminContentSnapshot> {
    const [newsRows, eventRows, carouselRows] = await Promise.all([
      this.database.select().from(news).orderBy(desc(news.updatedAt)),
      this.database.select().from(events).orderBy(desc(events.updatedAt)),
      this.database.select().from(carouselItems).orderBy(asc(carouselItems.sortOrder), desc(carouselItems.updatedAt)),
    ])
    return { news: newsRows, events: eventRows, carousel: carouselRows }
  }

  async createNews(input: AdminNewsInput, editor: string) {
    const now = new Date().toISOString()
    const row = {
      id: crypto.randomUUID(),
      ...input,
      publishedAt: input.status === 'published' ? (input.publishedAt ?? now) : input.publishedAt,
      createdAt: now,
      updatedAt: now,
      createdBy: editor,
      updatedBy: editor,
    }
    await this.database.batch([
      this.database.insert(news).values(row),
      this.database.insert(contentRevisions).values(revision('news', row.id, 'create', editor, null, row, now)),
    ])
    return row
  }

  async updateNews(id: string, input: AdminNewsInput, editor: string) {
    const previous = await this.database.query.news.findFirst({ where: eq(news.id, id) })
    if (!previous) return null
    const now = new Date().toISOString()
    const changes = {
      ...input,
      publishedAt: input.status === 'published' ? (input.publishedAt ?? previous.publishedAt ?? now) : input.publishedAt,
      updatedAt: now,
      updatedBy: editor,
    }
    const next = { ...previous, ...changes }
    await this.database.batch([
      this.database.update(news).set(changes).where(eq(news.id, id)),
      this.database.insert(contentRevisions).values(revision('news', id, 'update', editor, previous, next, now)),
    ])
    return next
  }

  async deleteNews(id: string, editor: string): Promise<boolean> {
    const previous = await this.database.query.news.findFirst({ where: eq(news.id, id) })
    if (!previous) return false
    const now = new Date().toISOString()
    await this.database.batch([
      this.database.delete(news).where(eq(news.id, id)),
      this.database.insert(contentRevisions).values(revision('news', id, 'delete', editor, previous, null, now)),
    ])
    return true
  }

  async createEvent(input: AdminEventInput, editor: string) {
    const now = new Date().toISOString()
    const row = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
      createdBy: editor,
      updatedBy: editor,
    }
    await this.database.batch([
      this.database.insert(events).values(row),
      this.database.insert(contentRevisions).values(revision('event', row.id, 'create', editor, null, row, now)),
    ])
    return row
  }

  async updateEvent(id: string, input: AdminEventInput, editor: string) {
    const previous = await this.database.query.events.findFirst({ where: eq(events.id, id) })
    if (!previous) return null
    const now = new Date().toISOString()
    const changes = { ...input, updatedAt: now, updatedBy: editor }
    const next = { ...previous, ...changes }
    await this.database.batch([
      this.database.update(events).set(changes).where(eq(events.id, id)),
      this.database.insert(contentRevisions).values(revision('event', id, 'update', editor, previous, next, now)),
    ])
    return next
  }

  async deleteEvent(id: string, editor: string): Promise<boolean> {
    const previous = await this.database.query.events.findFirst({ where: eq(events.id, id) })
    if (!previous) return false
    const now = new Date().toISOString()
    await this.database.batch([
      this.database.delete(events).where(eq(events.id, id)),
      this.database.insert(contentRevisions).values(revision('event', id, 'delete', editor, previous, null, now)),
    ])
    return true
  }

  async createCarousel(input: AdminCarouselInput, editor: string) {
    const now = new Date().toISOString()
    const row = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
      createdBy: editor,
      updatedBy: editor,
    }
    await this.database.batch([
      this.database.insert(carouselItems).values(row),
      this.database.insert(contentRevisions).values(revision('carousel', row.id, 'create', editor, null, row, now)),
    ])
    return row
  }

  async updateCarousel(id: string, input: AdminCarouselInput, editor: string) {
    const previous = await this.database.query.carouselItems.findFirst({ where: eq(carouselItems.id, id) })
    if (!previous) return null
    const now = new Date().toISOString()
    const changes = { ...input, updatedAt: now, updatedBy: editor }
    const next = { ...previous, ...changes }
    await this.database.batch([
      this.database.update(carouselItems).set(changes).where(eq(carouselItems.id, id)),
      this.database.insert(contentRevisions).values(revision('carousel', id, 'update', editor, previous, next, now)),
    ])
    return next
  }

  async deleteCarousel(id: string, editor: string): Promise<boolean> {
    const previous = await this.database.query.carouselItems.findFirst({ where: eq(carouselItems.id, id) })
    if (!previous) return false
    const now = new Date().toISOString()
    await this.database.batch([
      this.database.delete(carouselItems).where(eq(carouselItems.id, id)),
      this.database.insert(contentRevisions).values(revision('carousel', id, 'delete', editor, previous, null, now)),
    ])
    return true
  }

  async mediaReferenceCount(key: string): Promise<number> {
    const [newsCount, eventCount, carouselCount] = await Promise.all([
      this.database.select({ value: count() }).from(news).where(eq(news.coverImageKey, key)),
      this.database.select({ value: count() }).from(events).where(eq(events.coverImageKey, key)),
      this.database.select({ value: count() }).from(carouselItems).where(eq(carouselItems.imageKey, key)),
    ])
    return (newsCount[0]?.value ?? 0) + (eventCount[0]?.value ?? 0) + (carouselCount[0]?.value ?? 0)
  }

  async recordMediaDeletion(key: string, editor: string, previousValue: unknown): Promise<void> {
    const now = new Date().toISOString()
    await this.database.insert(contentRevisions).values(revision('media', key, 'delete', editor, previousValue, null, now))
  }

  async recordMediaCreation(key: string, editor: string, newValue: unknown): Promise<void> {
    const now = new Date().toISOString()
    await this.database.insert(contentRevisions).values(revision('media', key, 'create', editor, null, newValue, now))
  }
}
