import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent, locals }) => {
  return {
    user: locals.user!
  }
}
