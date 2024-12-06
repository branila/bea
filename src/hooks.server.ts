import type { Handle } from '@sveltejs/kit'
import { getPocketbaseInstance } from '$db'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.pb = getPocketbaseInstance()

  return await resolve(event)
}
