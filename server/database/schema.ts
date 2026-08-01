import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { eventStatuses, linkedContentTypes, newsStatuses } from '../../shared/types/content'

const auditColumns = {
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  createdBy: text('created_by').notNull(),
  updatedBy: text('updated_by').notNull(),
}

export const news = sqliteTable(
  'news',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    body: text('body').notNull(),
    coverImageKey: text('cover_image_key'),
    coverImageAlt: text('cover_image_alt'),
    category: text('category'),
    status: text('status', { enum: newsStatuses }).notNull().default('draft'),
    isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
    publishAt: text('publish_at'),
    publishedAt: text('published_at'),
    expiresAt: text('expires_at'),
    externalUrl: text('external_url'),
    ...auditColumns,
  },
  table => [
    uniqueIndex('uq_news_slug').on(table.slug),
    index('idx_news_publication').on(table.status, table.publishedAt, table.expiresAt),
    index('idx_news_featured').on(table.isFeatured, table.publishedAt),
    check('ck_news_status', sql`${table.status} in ('draft','scheduled','published','archived')`),
    check(
      'ck_news_cover_alt',
      sql`(${table.coverImageKey} is null and ${table.coverImageAlt} is null) or (${table.coverImageKey} is not null and length(trim(${table.coverImageAlt})) > 0)`,
    ),
  ],
)

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    body: text('body').notNull(),
    startAt: text('start_at').notNull(),
    endAt: text('end_at'),
    timezone: text('timezone').notNull().default('Asia/Kolkata'),
    locationName: text('location_name'),
    isOnline: integer('is_online', { mode: 'boolean' }).notNull().default(false),
    externalUrl: text('external_url'),
    coverImageKey: text('cover_image_key'),
    coverImageAlt: text('cover_image_alt'),
    status: text('status', { enum: eventStatuses }).notNull().default('draft'),
    isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
    publishAt: text('publish_at'),
    ...auditColumns,
  },
  table => [
    uniqueIndex('uq_events_slug').on(table.slug),
    index('idx_events_upcoming').on(table.status, table.startAt),
    index('idx_events_publication').on(table.status, table.publishAt),
    check(
      'ck_events_status',
      sql`${table.status} in ('draft','scheduled','published','postponed','cancelled','completed','archived')`,
    ),
    check('ck_events_dates', sql`${table.endAt} is null or ${table.endAt} >= ${table.startAt}`),
    check(
      'ck_events_cover_alt',
      sql`(${table.coverImageKey} is null and ${table.coverImageAlt} is null) or (${table.coverImageKey} is not null and length(trim(${table.coverImageAlt})) > 0)`,
    ),
  ],
)

export const carouselItems = sqliteTable(
  'carousel_items',
  {
    id: text('id').primaryKey(),
    eyebrow: text('eyebrow'),
    title: text('title').notNull(),
    summary: text('summary'),
    imageKey: text('image_key').notNull(),
    imageAlt: text('image_alt').notNull(),
    ctaLabel: text('cta_label'),
    ctaUrl: text('cta_url'),
    linkedContentType: text('linked_content_type', { enum: linkedContentTypes }),
    linkedContentId: text('linked_content_id'),
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
    startsAt: text('starts_at'),
    endsAt: text('ends_at'),
    ...auditColumns,
  },
  table => [
    index('idx_carousel_active_order').on(table.isActive, table.sortOrder),
    check(
      'ck_carousel_linked_type',
      sql`${table.linkedContentType} is null or ${table.linkedContentType} in ('news','event','custom')`,
    ),
    check('ck_carousel_schedule', sql`${table.endsAt} is null or ${table.startsAt} is null or ${table.endsAt} >= ${table.startsAt}`),
    check('ck_carousel_image_alt', sql`length(trim(${table.imageAlt})) > 0`),
  ],
)

export const contentRevisions = sqliteTable(
  'content_revisions',
  {
    id: text('id').primaryKey(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    action: text('action').notNull(),
    editorIdentity: text('editor_identity').notNull(),
    previousValue: text('previous_value'),
    newValue: text('new_value'),
    createdAt: text('created_at').notNull(),
  },
  table => [
    index('idx_revisions_entity').on(table.entityType, table.entityId, table.createdAt),
    check('ck_revisions_previous_json', sql`${table.previousValue} is null or json_valid(${table.previousValue})`),
    check('ck_revisions_new_json', sql`${table.newValue} is null or json_valid(${table.newValue})`),
  ],
)

export type NewsRow = typeof news.$inferSelect
export type EventRow = typeof events.$inferSelect
export type CarouselItemRow = typeof carouselItems.$inferSelect
