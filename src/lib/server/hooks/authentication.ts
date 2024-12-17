import { redirect, type Handle } from '@sveltejs/kit'
import type { User } from '$types/db'

// Authentication middleware for handling user sessions
const authentication: Handle = async ({event, resolve}) => {
  const pb = event.locals.pb

  // Load existing authentication state from cookies
  pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

  if (pb.authStore.isValid) {
    // Attempt to refresh the authentication token
    const [error] = await goCatch(
      pb.collection('users').authRefresh()
    )

    // Clear auth store if token refresh fails
    if (error) {
      pb.authStore.clear()
    }

    // Attach user information to the event locals
    event.locals.user = pb.authStore.record as unknown as User || undefined
  }

  const response = await resolve(event)

  // Send back the pb_auth cookie with the latest store state
  response.headers.append('set-cookie', pb.authStore.exportToCookie({
    httpOnly: false,
    secure: true,
    sameSite: 'strict'
  }))

  // if the uri is not /maintenance, redirect to /maintenance
  if (event.route.id != '/maintenance') {
    redirect(302, '/maintenance')
  }

  return response
}

export default authentication
