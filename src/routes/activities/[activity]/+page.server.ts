import { db } from '$db'
import { ilike } from 'drizzle-orm'
import type { PageServerLoad } from './$types';

import { activities } from '$schema';

export const load: PageServerLoad = async ({url}) => {

  const activityPath = url.href.split('/').pop();
  
  const activityName = decodeURI(activityPath!.replace(/-/g, ' '));

  const activity = await db
    .select()
    .from(activities)
    .where(ilike(activities.name, activityName))
    .limit(1)
    .then(results => results[0]);
    

  return {
    activity: activity,
  };
};