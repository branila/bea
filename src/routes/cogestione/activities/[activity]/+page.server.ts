import type { PageServerLoad } from './$types'
import { Roles, type Activity, type Registration } from '$types/db'
import { error } from '@sveltejs/kit'
import hasRole from '$lib/utils/hasRole'

export const load: PageServerLoad = async ({ locals, params }) => {
  const activity = params.activity

  const [activityQueryError, activityData] = await goCatch(locals.pb.collection('activities').getOne(activity))

  if (activityQueryError || !activityData) {
    error(400, 'Errore nel caricamento dell\'attività')
  }

  if (
    !activityData.organizers.some(organizer => organizer == locals.user?.id) &&
    !hasRole(locals.user!, Roles.Admin, Roles.Staff)
  ) {
    error(403, 'Non hai accesso a questa attività')
  }

  return {
    activity: activityData
  } as {
    activity: Activity
  }
}
