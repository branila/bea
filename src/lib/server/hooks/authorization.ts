import {type Handle, redirect} from '@sveltejs/kit'
import {Roles} from '$types/db'
import hasRole from '$lib/utils/hasRole'
import {error} from '$lib/utils/error'

// Authorization middleware for route access control
const authorization: Handle = async ({event, resolve}) => {
  const user = event.locals.user
  const path = event.url.pathname

  if (user?.banned) {
    error(403, `You don't have access to the system :(`)
  }

  const publicPaths = ['/', '/contacts', '/login', '/maintenance']

  // Allow access to public paths without authentication
  if (publicPaths.includes(path)) {
    return await resolve(event)
  }

  // Redirect unauthenticated users to the login page
  if (!user) {
    redirect(302, '/login')
  }

  // Role-based access control mapping for different routes
  const routePermissions = Object.entries({
    '/cogestione/registration': !hasRole(user, Roles.Staff, Roles.Docente),
    '/cogestione/ticket': !hasRole(user, Roles.Staff, Roles.Docente),
    '/cogestione/admin': hasRole(user, Roles.Admin),
    '/cogestione/classes': hasRole(user, Roles.Rappresentante, Roles.Admin),
    '/cogestione/activities': hasRole(user, Roles.Organizzatore, Roles.Admin, Roles.Docente),
    '/security': hasRole(user, Roles.Security, Roles.Staff, Roles.Admin),
    '/cogestione/staff': hasRole(user, Roles.Staff, Roles.Admin),
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
