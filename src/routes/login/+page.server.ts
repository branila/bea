import { PB_INSTANCE } from '$env/static/private'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({}) => {
  return {
    pbInstance: PB_INSTANCE
  }
}
