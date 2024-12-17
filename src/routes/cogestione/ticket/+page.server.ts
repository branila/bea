import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ parent, locals }) => {
  let [ticketQueryError, ticket] = await goCatch(
    locals.pb.collection('tickets').getFirstListItem(`user="${locals.user?.id}"`)
  )

  if (ticketQueryError || !ticket) {
    ticket = undefined
  }

  return {
    user: locals.user!,
    ticket
  }
}
