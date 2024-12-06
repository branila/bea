import PocketBase from 'pocketbase'
import type { BeaPocketBase } from '$types/db'
import { PB_INSTANCE, PB_AUTHTOKEN } from '$env/static/private'
import { error } from '@sveltejs/kit'

export function getPocketbaseInstance(): BeaPocketBase {
  if (!PB_INSTANCE) {
    throw error(500, 'Pocketbase instance not found')
  }

  const pb = new PocketBase(PB_INSTANCE) as BeaPocketBase

  if (!PB_AUTHTOKEN) {
    throw error(500, 'Pocketbase authtoken not found')
  }

  pb.authStore.save(PB_AUTHTOKEN)

  return pb
}
