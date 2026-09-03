import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { H3Event } from 'h3'
import { createError, getHeader } from 'h3'
import { decideEditorAuth } from '../../shared/utils/auth-policy'
import { getCloudflareBindings } from '../database/bindings'

export interface EditorIdentity {
  email: string
  subject: string
  source: 'cloudflare-access' | 'development-bypass'
}

interface EditorAuthConfig {
  cfAccessTeamDomain: string
  cfAccessAud: string
  devAuthBypass: boolean | string
}

function isEnabled(value: boolean | string): boolean {
  return value === true || value === 'true'
}

function verifiedTeamDomain(value: string): string {
  const url = new URL(value)
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.cloudflareaccess.com')) {
    throw new Error('Cloudflare Access team domain is invalid.')
  }
  return url.origin
}

export async function requireEditor(event: H3Event): Promise<EditorIdentity> {
  const config = useRuntimeConfig(event) as unknown as EditorAuthConfig
  const bindings = getCloudflareBindings(event)
  const assertion = getHeader(event, 'cf-access-jwt-assertion') ?? ''
  const decision = decideEditorAuth({
    isDevelopmentEnvironment: import.meta.dev || bindings?.INPA_ENVIRONMENT === 'local',
    bypassRequested: isEnabled(config.devAuthBypass) || isEnabled(bindings?.NUXT_DEV_AUTH_BYPASS ?? false),
    teamDomainConfigured: config.cfAccessTeamDomain.length > 0,
    audienceConfigured: config.cfAccessAud.length > 0,
    assertionPresent: assertion.length > 0,
  })

  if (decision === 'development-bypass') {
    return {
      email: 'local-editor@example.invalid',
      subject: 'local-development-only',
      source: 'development-bypass',
    }
  }

  if (decision === 'deny') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Editor access is not available.',
    })
  }

  try {
    const issuer = verifiedTeamDomain(config.cfAccessTeamDomain)
    const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`))
    const { payload } = await jwtVerify(assertion, jwks, {
      issuer,
      audience: config.cfAccessAud,
    })

    if (typeof payload.email !== 'string' || typeof payload.sub !== 'string') {
      throw new Error('Required identity claims are missing.')
    }

    return {
      email: payload.email,
      subject: payload.sub,
      source: 'cloudflare-access',
    }
  } catch {
    throw createError({
      statusCode: 403,
      statusMessage: 'Editor access could not be verified.',
    })
  }
}
