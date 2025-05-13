import { decodeIdToken, type OAuth2Tokens } from 'arctic'
import { error, redirect, type Cookies, type RequestEvent } from '@sveltejs/kit'
import { google } from '$lib/server/auth'
import { ENV } from '$env/static/private'
import { randomBytes } from 'crypto'
import { db } from '$lib/server/db'
import { sessions, users } from '$lib/schema'
import { eq } from 'drizzle-orm'

type UserData = {
  googleId: string
  name: string
  surname: string
  email: string
}

type GoogleUserData = {
  sub: string,
  given_name: string,
  family_name: string,
  email: string
}

async function getOrCreateUser({ email, name, surname, googleId }: UserData) {
  let [user] = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (!user) {
    [user] = await db.insert(users)
      .values({
        email, name, surname, googleId,
        roles: email.includes('studente') ? ['studente'] : ['docente']
      })
      .returning()
  }

  return user
}

async function getOrCreateSession(user: string, cookies: Cookies) {
  let [session] = await db.select()
    .from(sessions)
    .where(eq(sessions.user, user))

  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const expiration = new Date(Date.now() + sevenDays)

  if (session) {
    // Refresh session expiration
    await db.update(sessions)
      .set({ expiration })
      .where(eq(sessions.id, session.id))
  } else {
    const id = randomBytes(64).toString('hex');

    // Create new session for the user
    [session] = await db.insert(sessions)
      .values({ id, user, expiration })
      .returning()
  }

  cookies.set('session_id', session.id, {
    path: '/',
    httpOnly: true,
    secure: ENV === 'production',
    sameSite: 'strict',
    expires: session.expiration
  })
}

export async function GET({ cookies, url }: RequestEvent) {
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = cookies.get('google_oauth_state') ?? null
  const codeVerifier = cookies.get('google_code_verifier') ?? null

  if (!code || !state || !storedState || !codeVerifier) {
    error(400, 'Parametri di autenticazione OAuth mancanti o invalidi')
  }

  if (state !== storedState) {
    error(400, 'Intercettato possibile attacco CSRF')
  }

  // Exchange authorization code for OAuth tokens
  const [invalidAuthCodeError, tokens] = await goCatch(
    google.validateAuthorizationCode(code!, codeVerifier!)
  )

  if (invalidAuthCodeError || !tokens) {
    error(400, 'Impossibile validare il codice di autorizzazione google')
  }

  const {
    sub: googleId, given_name: name, family_name: surname, email
  } = decodeIdToken(tokens.idToken()) as GoogleUserData

  if (!googleId || !name || !surname || !email) {
    error(400, 'Invalid or incomplete ID token claims')
  }

  let [user] = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (!user) {
    [user] = await db.insert(users)
      .values({
        email, name, surname, googleId,
        roles: email.includes('studente') ? ['studente'] : ['docente']
      })
      .returning()
  }

  let [session] = await db.select()
    .from(sessions)
    .where(eq(sessions.user, user.email))

  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const expiration = new Date(Date.now() + sevenDays)

  if (session) {
    // Refresh session expiration
    await db.update(sessions)
      .set({ expiration })
      .where(eq(sessions.id, session.id))
  } else {
    const id = randomBytes(64).toString('hex');

    // Create new session for the user
    [session] = await db.insert(sessions)
      .values({ id, user: user.email, expiration })
      .returning()
  }

  cookies.set('session_id', session.id, {
    path: '/',
    httpOnly: true,
    secure: ENV === 'production',
    sameSite: 'strict',
    expires: session.expiration
  })

  redirect(302, '/cogestione')
}
