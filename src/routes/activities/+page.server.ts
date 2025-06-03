import { db } from '$db'
import { ne, and } from 'drizzle-orm'
import type { PageServerLoad } from './$types';

import { activities } from '$schema';

export const load: PageServerLoad = async () => {
  // Fetch all activities from the database
  const activitiesList = await db
    .select()
    .from(activities)
    .where(and(ne(activities.name, 'Assente'), ne(activities.name, 'In classe'), ne(activities.name, 'Security'))) 
    .orderBy(activities.name);

  return {
    activities: activitiesList,
  };
};