import { decodeIdToken, type OAuth2Tokens } from 'arctic'
import { error, redirect, type Cookies, type RequestEvent } from '@sveltejs/kit'
import { google } from '$lib/server/auth'
import { ENV } from '$env/static/private'
import { randomBytes } from 'crypto'
import { db } from '$lib/server/db'
import { sessions, users } from '$db/schema'
import { eq } from 'drizzle-orm'

type UserData = {
  sub: string
  given_name: string
  family_name: string
  email: string
}

function validateOAuthParams(code: string | null, state: string | null, storedState: string | null, codeVerifier: string | null) {
  if (!code || !state || !storedState || !codeVerifier) {
    error(400, 'Parametri di autenticazione OAuth mancanti o invalidi')
  }

  if (state !== storedState) {
    error(400, 'Intercettato possibile attacco CSRF')
  }
}

async function getOrCreateUser(userData: UserData) {
  let user = ( await db.select()
    .from(users)
    .where(eq(users.email, userData.email))
    .limit(1)
  )[0]

  if (!user) {
    user = (await db.insert(users).values({
      email: userData.email,
      name: userData.given_name,
      surname: userData.family_name,
      googleId: userData.sub,
      verified: true
    }).returning())[0]
  }

  return user
}

async function createSession(userEmail: string, cookies: Cookies) {
  const sessionId = randomBytes(64).toString('hex')
  const expiration = new Date()
  expiration.setDate(expiration.getDate() + 7) // 7 days expiration

  const session = (await db.insert(sessions).values({
    id: sessionId,
    user: userEmail,
    expiration
  }).returning())[0]

  cookies.set('session_id', sessionId, {
    path: '/',
    httpOnly: true,
    secure: ENV === 'production',
    sameSite: 'strict',
    expires: session.expiration
  })
}

export async function GET({ cookies, url }: RequestEvent) {
  // Validate OAuth parameters
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = cookies.get('google_oauth_state') ?? null
  const codeVerifier = cookies.get('google_code_verifier') ?? null

  validateOAuthParams(code, state, storedState, codeVerifier)

  // Exchange authorization code for OAuth tokens
  const [invalidAuthCodeError, tokens] = await goCatch(
    google.validateAuthorizationCode(code!, codeVerifier!)
  )

  if (invalidAuthCodeError || !tokens) {
    error(400, 'Impossibile validare il codice di autorizzazione google')
  }

  const userData = decodeIdToken(tokens.idToken()) as UserData

  if (!userData.sub || !userData.given_name || !userData.family_name || !userData.email) {
    error(400, 'Invalid or incomplete ID token claims')
  }

  const user = await getOrCreateUser(userData)

  await createSession(user.email, cookies)

  redirect(302, '/cogestione')
}
