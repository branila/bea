import type { Handle, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import authentication from '$lib/server/hooks/authentication'
import authorization from '$lib/server/hooks/authorization'
import errorsHandler from '$lib/server/hooks/errors'
import { eventDays } from '$schema'

import { DATABASE_URL } from '$env/static/private'
import { db } from '$db'

async function pingTest() {
  await db.select().from(eventDays)
  console.log(DATABASE_URL)
}

export const handle: Handle = sequence(
  authentication, authorization
)

export const handleError = errorsHandler
