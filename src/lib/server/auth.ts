import { Google } from 'arctic'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private'

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	'http://localhost:5000/login/callback' // TODO: dacci un'occhiata che sta cosa in prod non va
)
