import type { H3Event } from 'h3'
import type {
  ApiResponse,
  PublicCarouselItem,
  PublicEventItem,
  PublicHomeData,
  PublicNewsItem,
} from '../../shared/types/content'
import { useDatabase } from '../database/client'
import { PublicContentRepository } from '../repositories/public-content.repository'

type PublicSource = ApiResponse<unknown>['meta']['source']

function response<T>(data: T, source: PublicSource): ApiResponse<T> {
  return {
    data,
    meta: {
      generatedAt: new Date().toISOString(),
      source,
    },
  }
}

function repositoryFor(event: H3Event): PublicContentRepository | null {
  const database = useDatabase(event)
  return database ? new PublicContentRepository(database) : null
}

export async function getPublicHome(event: H3Event): Promise<ApiResponse<PublicHomeData>> {
  const repository = repositoryFor(event)
  if (!repository) return response({ news: [], events: [], carousel: [] }, 'unavailable')

  const now = new Date().toISOString()
  const [newsItems, eventItems, carousel] = await Promise.all([
    repository.listLatestNews(now),
    repository.listUpcomingEvents(now),
    repository.listActiveCarouselItems(now),
  ])

  const mappedNews: PublicNewsItem[] = newsItems
    .filter(item => item.publishedAt !== null)
    .map(item => ({ ...item, publishedAt: item.publishedAt as string }))

  return response(
    {
      news: mappedNews,
      events: eventItems as PublicEventItem[],
      carousel: carousel as PublicCarouselItem[],
    },
    'd1',
  )
}

export async function getPublicNews(event: H3Event): Promise<ApiResponse<PublicNewsItem[]>> {
  const repository = repositoryFor(event)
  if (!repository) return response([], 'unavailable')
  const rows = await repository.listLatestNews(new Date().toISOString(), 24)
  const data = rows
    .filter(item => item.publishedAt !== null)
    .map(item => ({ ...item, publishedAt: item.publishedAt as string }))
  return response(data, 'd1')
}

export async function getPublicEvents(event: H3Event): Promise<ApiResponse<PublicEventItem[]>> {
  const repository = repositoryFor(event)
  if (!repository) return response([], 'unavailable')
  const data = await repository.listUpcomingEvents(new Date().toISOString(), 50)
  return response(data as PublicEventItem[], 'd1')
}

export async function getPublicCarousel(event: H3Event): Promise<ApiResponse<PublicCarouselItem[]>> {
  const repository = repositoryFor(event)
  if (!repository) return response([], 'unavailable')
  const data = await repository.listActiveCarouselItems(new Date().toISOString())
  return response(data as PublicCarouselItem[], 'd1')
}

export async function getPublishedNewsBySlug(event: H3Event, slug: string) {
  const repository = repositoryFor(event)
  if (!repository) return response(null, 'unavailable')
  return response((await repository.getNewsBySlug(slug, new Date().toISOString())) ?? null, 'd1')
}

export async function getPublishedEventBySlug(event: H3Event, slug: string) {
  const repository = repositoryFor(event)
  if (!repository) return response(null, 'unavailable')
  return response((await repository.getEventBySlug(slug, new Date().toISOString())) ?? null, 'd1')
}
