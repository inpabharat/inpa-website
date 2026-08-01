import type { H3Event } from 'h3'

export interface CloudflareBindings {
  DB?: D1Database
  MEDIA?: R2Bucket
  ASSETS?: Fetcher
}

interface CloudflareEventContext {
  env?: CloudflareBindings
}

export function getCloudflareBindings(event: H3Event): CloudflareBindings | null {
  const cloudflare = event.context.cloudflare as CloudflareEventContext | undefined
  return cloudflare?.env ?? null
}

export function getD1Binding(event: H3Event): D1Database | null {
  return getCloudflareBindings(event)?.DB ?? null
}

export function getR2Binding(event: H3Event): R2Bucket | null {
  return getCloudflareBindings(event)?.MEDIA ?? null
}
