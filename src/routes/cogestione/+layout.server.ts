import type { LayoutServerLoad } from './$types'
import type { Registration, User, Activity } from '$types/db'
import { Roles } from '$types/db'

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user

  let [error, registration] = await goCatch(
    locals.pb.collection('registrations').getFirstListItem(`user="${user?.id}"`)
  )

  if (error) {
    registration = undefined
  }

  let activity: Activity | undefined

  if (user?.roles.includes(Roles.Organizzatore)) {
    let [error, activities] = await goCatch(
      locals.pb.collection('activities').getFullList()
    )

    if (error) {
      console.error(error)
      activities = []
    }

    activity = activities?.find(activity => activity.organizers.includes(user.id))
  }

  return { user, registration, activity } as {
    user: User,
    registration: Registration | undefined,
    activity: Activity | undefined
  }
}
