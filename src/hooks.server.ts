import goCatch from '$lib/utils/gocatch'
import type { Handle } from '@sveltejs/kit'
import { getPocketbaseInstance } from '$db'
import { Roles } from '$types/db'
import { ClientResponseError } from 'pocketbase'

globalThis.goCatch = goCatch

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.pb = getPocketbaseInstance()

  let [error, user] = await goCatch(
    event.locals.pb.collection('users').getFirstListItem('email="branila.claudiustefan.studente@itispaleocapa.it"'),
  )

  if (error) {
    console.error(error)
  }

  event.locals.user = user

  return await resolve(event)
}
