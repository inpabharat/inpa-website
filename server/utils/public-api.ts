import type { EventHandlerRequest, H3Event } from 'h3'
import { setResponseHeader } from 'h3'

export function preparePublicResponse(event: H3Event<EventHandlerRequest>): void {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=0, s-maxage=60, must-revalidate')
  setResponseHeader(event, 'Vary', 'Accept-Encoding')
}
