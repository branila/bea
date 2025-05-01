import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { generateState, generateCodeVerifier } from 'arctic'
import { google } from '$lib/server/auth'
import { ENV } from '$env/static/private'

export const actions: Actions = {
  google: async ({ cookies }) => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()

    const url = google.createAuthorizationURL(
      state, codeVerifier,
      ['openid', 'profile', 'email']
    )

    cookies.set('google_oauth_state', state, {
      path: '/',
      httpOnly: true,
      secure: ENV == 'production',
      maxAge: 60 * 10, // 10 minuti,
      sameSite: 'lax'
    })

    cookies.set('google_code_verifier', codeVerifier, {
      path: '/',
      httpOnly: true,
      secure: ENV === 'production',
      maxAge: 60 * 10, // 10 minuti
      sameSite: 'lax'
    })

    throw redirect(302, url.toString())
  }
}
