import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('session_id', { path: '/' })

  return json({ success: true })
}
