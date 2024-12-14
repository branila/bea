import notify from '$lib/utils/notify'
import {type HandleServerError} from '@sveltejs/kit'

export const errorsHandler: HandleServerError = async ({ error, status, event }) => {
  const user = event.locals.user?.email || 'Guest'
  const err = false|| new Error('Unknown Error')

  const msg = `User: ${user}\n\n${err.stack}`

  console.error(msg)

  if (status !== 404) {
    await notify(msg)
  }
}

export default errorsHandler
