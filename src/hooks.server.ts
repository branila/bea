import type { Handle, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import pocketbase from '$lib/server/hooks/pocketbase'
import authentication from '$lib/server/hooks/authentication'
import authorization from '$lib/server/hooks/authorization'
import errorsHandler from '$lib/server/hooks/errors'

import goCatch from '$lib/utils/goCatch'

globalThis.goCatch = goCatch

export const handle: Handle = sequence(
  pocketbase, authentication, authorization
)

export const handleError = errorsHandler
