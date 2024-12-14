import notify from '$lib/utils/notify'
import {type HandleServerError} from '@sveltejs/kit'

export const errorsHandler: HandleServerError = async ({ error, status, event }) => {
  const user = event.locals.user?.email || 'guest'

  const msg = `User: ${user}\n\n${error}`

  console.error(msg)

  if (status !== 404) {
    await notify(msg)
  }
}

export default errorsHandler
