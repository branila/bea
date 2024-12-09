import { type Handle } from '@sveltejs/kit'

// TODO: Implement a real authentication system
const authentication: Handle = async ({ event, resolve }) => {
  const pb = event.locals.pb

  const email = 'branila.claudiustefan.studente@itispaleocapa.it'

  const [error, user] = await goCatch(
    pb.collection('users').getFirstListItem(`email="${email}"`),
  )

  if (error) {
    console.error(error)
  }

  event.locals.user = user

  return await resolve(event)
}

export default authentication
