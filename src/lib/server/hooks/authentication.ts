import { redirect, type Handle } from '@sveltejs/kit'
import { sessions, users } from '$lib/schema'
import { db } from '$db'
import { eq } from 'drizzle-orm'

// Authentication middleware for handling user sessions
const authentication: Handle = async ({ event, resolve }) => {
  const { cookies, locals } = event

  const sessionId = event.cookies.get('session_id') || null

  if (!sessionId) {
    return await resolve(event)
  }

  const [{ user, session }] = await db.select({
    user: users,
    session: sessions,
  })
  .from(sessions)
  .innerJoin(users, eq(sessions.user, users.email))
  .where(eq(sessions.id, sessionId))
  .limit(1)

  // If the session is invalid or expired
  if (!user || !session || session.expiration < new Date()) {
    cookies.delete('session_id', { path: '/' })

    redirect(302, '/login')
  }

  if (user && session) {
    locals.user = user
  }

  return await resolve(event)
}

export default authentication
