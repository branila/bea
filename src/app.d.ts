import type { User } from '$types'

declare global {
  async function goCatch<T, E extends new (message?: string) => Error>(
    promise: Promise<T>,
    errorsToCatch?: E[] | E
  ): Promise<[undefined, T] | [InstanceType<E>, undefined]>;

  namespace App {
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}

    interface Locals {
      user: User | undefined
    }
  }
}

export {};
