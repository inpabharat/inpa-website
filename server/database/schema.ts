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

export const landscapeInstitutions = sqliteTable(
  'landscape_institutions',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    department: text('department'),
    city: text('city').notNull(),
    state: text('state').notNull(),
    region: text('region').notNull(),
    institutionType: text('institution_type').notNull(),
    character: text('character'),
    latitude: integer('latitude_microdegrees'),
    longitude: integer('longitude_microdegrees'),
    officialUrl: text('official_url'),
    description: text('description').notNull(),
    verificationStatus: text('verification_status').notNull().default('pending'),
    sourceProfile: text('source_profile'),
    lastVerified: text('last_verified'),
    editorialNotes: text('editorial_notes'),
    ...auditColumns,
  },
  table => [
    index('idx_landscape_institutions_region_type').on(table.region, table.institutionType),
    index('idx_landscape_institutions_verification').on(table.verificationStatus, table.lastVerified),
  ],
)

export const landscapeResearchers = sqliteTable(
  'landscape_researchers',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id').notNull().references(() => landscapeInstitutions.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    designation: text('designation'),
    department: text('department'),
    character: text('character'),
    officialProfileUrl: text('official_profile_url'),
    orcid: text('orcid'),
    verificationStatus: text('verification_status').notNull().default('pending'),
    lastVerified: text('last_verified'),
    ...auditColumns,
  },
  table => [index('idx_landscape_researchers_institution').on(table.institutionId)],
)

export const landscapeFacilities = sqliteTable(
  'landscape_facilities',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id').notNull().references(() => landscapeInstitutions.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    facilityType: text('facility_type'),
    detectorSystems: text('detector_systems'),
    capabilities: text('capabilities'),
    isUserFacility: integer('is_user_facility', { mode: 'boolean' }).notNull().default(false),
    officialUrl: text('official_url'),
    verificationStatus: text('verification_status').notNull().default('pending'),
    lastVerified: text('last_verified'),
    ...auditColumns,
  },
  table => [index('idx_landscape_facilities_institution').on(table.institutionId)],
)

export const landscapeResearchAreas = sqliteTable(
  'landscape_research_areas',
  {
    id: text('id').primaryKey(),
    label: text('label').notNull(),
  },
  table => [uniqueIndex('uq_landscape_research_areas_label').on(table.label)],
)

export const landscapeInstitutionAreas = sqliteTable(
  'landscape_institution_areas',
  {
    institutionId: text('institution_id').notNull().references(() => landscapeInstitutions.id, { onDelete: 'cascade' }),
    researchAreaId: text('research_area_id').notNull().references(() => landscapeResearchAreas.id, { onDelete: 'cascade' }),
  },
  table => [
    uniqueIndex('uq_landscape_institution_area').on(table.institutionId, table.researchAreaId),
    index('idx_landscape_institution_areas_area').on(table.researchAreaId),
  ],
)

export const landscapeResearcherAreas = sqliteTable(
  'landscape_researcher_areas',
  {
    researcherId: text('researcher_id').notNull().references(() => landscapeResearchers.id, { onDelete: 'cascade' }),
    researchAreaId: text('research_area_id').notNull().references(() => landscapeResearchAreas.id, { onDelete: 'cascade' }),
  },
  table => [
    uniqueIndex('uq_landscape_researcher_area').on(table.researcherId, table.researchAreaId),
    index('idx_landscape_researcher_areas_area').on(table.researchAreaId),
  ],
)

export type NewsRow = typeof news.$inferSelect
export type EventRow = typeof events.$inferSelect
export type CarouselItemRow = typeof carouselItems.$inferSelect
export type LandscapeInstitutionRow = typeof landscapeInstitutions.$inferSelect
export type LandscapeResearcherRow = typeof landscapeResearchers.$inferSelect
export type LandscapeFacilityRow = typeof landscapeFacilities.$inferSelect
