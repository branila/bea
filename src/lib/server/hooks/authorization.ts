import { db } from '$db'
import hasRoles from '$lib/utils/has-roles'
import { opening } from '$schema'
import { type Handle, redirect } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'

// Authorization middleware for route access control
const authorization: Handle = async ({ event, resolve }) => {
  const user = event.locals.user
  const path = event.url.pathname

  if (user?.banned) {
    error(403, `You don't have access to the system :(`)
  }

  const publicPaths = ['/', '/contacts', '/login', '/maintenance', '/activities', '/login/callback']

  if (user && path == '/login') {
    redirect(302, '/cogestione')
  }

  if (user && path == '/cogestione/classes') {
    redirect(302, `/cogestione/classes/${user.class}`)
  }

  // Allow access to public paths without authentication
  if (publicPaths.includes(path)) {
    return await resolve(event)
  }

  const registrationWindow = await db
    .select()
    .from(opening)

  if (new Date(Date.now()) < registrationWindow[0].opening) {
    redirect(302, '/maintenance')
  }

  // Redirect unauthenticated users to the login page
  if (!user) {
    redirect(302, '/login')
  }

  const routePermissions = Object.entries({
    '/cogestione/registration': !hasRoles(user, 'docente'),
    '/cogestione/ticket': !hasRoles(user, 'docente'),
    '/cogestione/admin': hasRoles(user, 'amministratore'),
    '/cogestione/classes': hasRoles(user, 'rappresentante', 'amministratore', 'docente'),
    '/cogestione/activities': hasRoles(user, 'organizzatore', 'amministratore', 'docente'),
    '/security': hasRoles(user, 'sicurezza', 'amministratore', 'docente'),
  })

  // Redirect unauthorized users to the login page
  for (const [route, permission] of routePermissions) {
    if (path.startsWith(route) && !permission) {
      redirect(302, '/login')
    }
  }

  return await resolve(event)
}

export default authorization
