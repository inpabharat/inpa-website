import { drizzle } from 'drizzle-orm/d1'
import type { H3Event } from 'h3'
import * as schema from './schema'
import { getD1Binding } from './bindings'

export type InpaDatabase = ReturnType<typeof createDatabase>

function createDatabase(binding: D1Database) {
  return drizzle(binding, { schema })
}

export function useDatabase(event: H3Event): InpaDatabase | null {
  const binding = getD1Binding(event)
  return binding ? createDatabase(binding) : null
}
