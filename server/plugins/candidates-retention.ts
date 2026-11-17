import { createDatabase } from '../database/client'
import { CandidatesRepository } from '../repositories/candidates.repository'
import type { CloudflareBindings } from '../database/bindings'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('cloudflare:scheduled', async ({ env }) => {
    const database = (env as CloudflareBindings).DB
    if (database) await new CandidatesRepository(createDatabase(database)).purge(new Date().toISOString())
  })
})
