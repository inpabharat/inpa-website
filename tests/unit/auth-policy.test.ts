import { describe, expect, it } from 'vitest'
import { decideEditorAuth } from '../../shared/utils/auth-policy'

describe('decideEditorAuth', () => {
  it('allows an explicitly requested bypass only in a development build', () => {
    expect(decideEditorAuth({
      isDevelopmentBuild: true,
      bypassRequested: true,
      teamDomainConfigured: false,
      audienceConfigured: false,
      assertionPresent: false,
    })).toBe('development-bypass')
  })

  it('fails closed in production when Access configuration is missing', () => {
    expect(decideEditorAuth({
      isDevelopmentBuild: false,
      bypassRequested: true,
      teamDomainConfigured: false,
      audienceConfigured: false,
      assertionPresent: false,
    })).toBe('deny')
  })

  it('requires configuration and an assertion before verification', () => {
    expect(decideEditorAuth({
      isDevelopmentBuild: false,
      bypassRequested: false,
      teamDomainConfigured: true,
      audienceConfigured: true,
      assertionPresent: true,
    })).toBe('verify-access-jwt')
  })
})
