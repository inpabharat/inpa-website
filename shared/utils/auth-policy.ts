export interface AuthPolicyInput {
  isDevelopmentBuild: boolean
  bypassRequested: boolean
  teamDomainConfigured: boolean
  audienceConfigured: boolean
  assertionPresent: boolean
}

export type AuthPolicyDecision = 'development-bypass' | 'verify-access-jwt' | 'deny'

export function decideEditorAuth(input: AuthPolicyInput): AuthPolicyDecision {
  if (input.isDevelopmentBuild && input.bypassRequested) return 'development-bypass'
  if (!input.teamDomainConfigured || !input.audienceConfigured || !input.assertionPresent) return 'deny'
  return 'verify-access-jwt'
}
