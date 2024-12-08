
import { type Handle, error } from '@sveltejs/kit'
import PocketBase from 'pocketbase'
import type { BeaPocketBase } from '$types/db'
import { PB_INSTANCE, PB_AUTHTOKEN } from '$env/static/private'

const pocketbase: Handle = async ({ event, resolve }) => {
  if (!PB_INSTANCE) {
    error(500, 'Pocketbase instance not found')
  }

  const pb = new PocketBase(PB_INSTANCE) as BeaPocketBase

  if (!PB_AUTHTOKEN) {
    error(500, 'Pocketbase authtoken not found')
  }

  pb.authStore.save(PB_AUTHTOKEN)

  event.locals.pb = pb

  return await resolve(event)
}

export default pocketbase
