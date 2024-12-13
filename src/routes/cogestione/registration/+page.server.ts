import type { PageServerLoad, Actions } from './$types'
import type { User, Registration, Activity } from '$types/db'

export const load: PageServerLoad = async ({ parent, locals }) => {
  const parentData = await parent()

  let [error, activities] = await goCatch(locals.pb.collection('activities').getFullList())

  if (error || !activities) {
    activities = []
  }

  // Remove organizers from activities for safety reasons
  activities.forEach(activity => activity.organizers = [])

  // Filters out sold out activities
  activities = activities.filter(activity => {
    return !activity.capacity.every(capacity => capacity === 0)
  })

  return {
    registration: parentData.registration,
    activities
  } as {
    registration: Registration | undefined,
    activities: Activity[]
  }
}


export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData()
		const firstActivity = data.get('firstActivity')
		const secondActivity = data.get('secondActivity')
		const thirdActivity = data.get('thirdActivity')

		const [error] = await goCatch(locals.pb.collection('registrations').create({
      user: locals.user!.id,
      firstActivity,
      secondActivity,
      thirdActivity,
    }))

		if (error) {
		  return { status: 500 }
    }

		return { status: 200 }
	}
} satisfies Actions;
