import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { bulletinSources } from '../../content/site/bulletin-sources'

describe('Nuclear Horizons archive', () => {
  it('publishes each issue with a unique PDF and cover path', () => {
    const downloadPaths = bulletinSources.map(issue => issue.downloadPath)
    const coverPaths = bulletinSources.map(issue => issue.coverImage)

    expect(new Set(downloadPaths).size).toBe(bulletinSources.length)
    expect(new Set(coverPaths).size).toBe(bulletinSources.length)

    for (const issue of bulletinSources) {
      expect(existsSync(resolve('public', issue.downloadPath.replace(/^\//, '')))).toBe(true)
      expect(existsSync(resolve('public', issue.coverImage.replace(/^\//, '')))).toBe(true)
      expect(issue.pageCount).toBeGreaterThan(0)
    }
  })
})
