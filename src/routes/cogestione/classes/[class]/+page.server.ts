import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { type User, type Registration, Roles } from '$types/db'
import hasRole from '$lib/utils/hasRole'

export const load: PageServerLoad = async ({ locals, params }) => {
  const queriedClass = params.class

  if (queriedClass != locals.user?.class && !hasRole(locals.user!, Roles.Admin, Roles.Staff)) {
    error(403, 'Non hai accesso a questa classe')
  }

  const [studentsQueryError, students] = await goCatch(locals.pb.collection('users').getFullList({
    filter: `class="${queriedClass}"`
  }))

  if (studentsQueryError || students.length == 0) {
    error(400, 'Errore nel caricamento degli studenti')
  }

  const [studentRegistrationsQueryError, studentRegistrations] = await goCatch(locals.pb.collection('registrations').getFullList({
    filter: `user.class="${queriedClass}"`,
    expand: 'firstActivity,secondActivity,thirdActivity'
  }))

  if (studentRegistrationsQueryError || studentRegistrations.length == 0) {
    error(400, 'Errore nel caricamento delle registrazioni')
  }

  return {
    students,
    registrations: studentRegistrations
  } as {
    students: User[]
    registrations: Registration[]
  }
}
