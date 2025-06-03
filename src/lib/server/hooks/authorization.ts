import { db } from '$db'
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

  const publicPaths = ['/', '/contacts', '/login', '/maintenance', '/login/callback']

  if (user && path == '/login') {
    redirect(302, '/cogestione')
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

  // const routePermissions = Object.entries({
  //   '/cogestione/registration': !hasRole(user, Roles.Docente),
  //   '/cogestione/ticket': !hasRole(user, Roles.Docente),
  //   '/cogestione/admin': hasRole(user, Roles.Admin),
  //   '/cogestione/classes': hasRole(user, Roles.Rappresentante, Roles.Admin),
  //   '/cogestione/activities': hasRole(user, Roles.Organizzatore, Roles.Admin, Roles.Docente),
  //   '/security': hasRole(user, Roles.Security, Roles.Admin, Roles.Docente),
  //   '/cogestione/staff': hasRole(user, Roles.Admin),
  // })

  // // Redirect unauthorized users to the login page
  // for (const [route, permission] of routePermissions) {
  //   if (path.startsWith(route) && !permission) {
  //     redirect(302, '/login')
  //   }
  // }

  return await resolve(event)
}

export default authorization
