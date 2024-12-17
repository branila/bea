import type { PageServerLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ parent, locals }) => {
  let [ticketQueryError, ticket] = await goCatch(
    locals.pb.collection('tickets').getFirstListItem(`user="${locals.user?.id}"`)
  )

  if (ticketQueryError || !ticket) {
    redirect(302, '/cogestione/registration')
  }

  return {
    user: locals.user!,
    ticket
  }
}
