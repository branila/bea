import type { PageServerLoad, Actions } from './$types'
import type { User, Registration, Activity } from '$types/db'
import { sendMail } from '$lib/server/scripts/emailService'

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

		const firstActivity = await locals.pb.collection('activities').getOne(data.get('firstActivity') as string)
		const secondActivity = await locals.pb.collection('activities').getOne(data.get('secondActivity') as string)
		const thirdActivity = await locals.pb.collection('activities').getOne(data.get('thirdActivity') as string)

		// Checks if the activities are still available
		if (firstActivity.capacity.every(capacity => capacity === 0) ||
      secondActivity.capacity.every(capacity => capacity === 0) ||
      thirdActivity.capacity.every(capacity => capacity === 0)) {
      return console.error('Una o più attività sono esaurite')
    }

		if (firstActivity.turns == 1) {
		  firstActivity.capacity[0]--
		} else {
		  firstActivity.capacity[0]--
      secondActivity.capacity[1]--
      thirdActivity.capacity[2]--
		}

    const registration = await locals.pb.collection('registrations').create({
      user: locals.user!.id,
      firstActivity: firstActivity.id,
      secondActivity: secondActivity.id,
      thirdActivity: thirdActivity.id,
    })

    await locals.pb.collection('tickets').create({
      user: locals.user!.id,
      registration: registration.id,
    })

    await locals.pb.collection('activities').update(firstActivity.id, firstActivity)

    await sendMail(locals.user!.id, locals.user!.email)
	}
} satisfies Actions;
