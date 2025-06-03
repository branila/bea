import { db } from '$db'
import { opening } from '$schema'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const registrationWindow = await db
    .select()
    .from(opening)

  return {
    opening: registrationWindow[0].opening
  }
}
