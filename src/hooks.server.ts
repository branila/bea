import type { Handle, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import authentication from '$lib/server/hooks/authentication'
import authorization from '$lib/server/hooks/authorization'
import errorsHandler from '$lib/server/hooks/errors'

export const handle: Handle = sequence(
  authentication, authorization
)

export const handleError = errorsHandler
