import type {BeaPocketBase, User} from "$types/db";
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
      pb: BeaPocketBase;
      user: User; //User | undefined
    }
  }
}

export {};
