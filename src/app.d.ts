import { type BeaPocketBase } from '$types/db'

declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface Locals {
		  pb: BeaPocketBase
		}
	}
}

export {}
