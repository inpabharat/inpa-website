import type { EventHandlerRequest, H3Event } from 'h3'
import { setResponseHeader } from 'h3'

export function preparePublicResponse(event: H3Event<EventHandlerRequest>): void {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600')
  setResponseHeader(event, 'Vary', 'Accept-Encoding')
}
