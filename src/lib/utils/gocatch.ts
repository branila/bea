/**
 * Handles a promise and captures errors, returning the error or the result in a tuple.
 *
 * This utility function helps manage promises by avoiding the need for try-catch blocks.
 * It captures errors and returns them in a consistent format, optionally filtering
 * for specific error types. Unexpected errors can be re-thrown.
 *
 * @template T - The type of the resolved value of the promise.
 * @template E - The type of the error class to catch, extending the `Error` class.
 *
 * @param {Promise<T>} promise - The promise to handle.
 * @param {E[] | E} [errorsToCatch] - An optional value that can be either a single error constructor
 * or an array of error constructors. If provided, only errors matching these constructors will be captured.
 * Other errors are re-thrown.
 *
 * @returns {Promise<[undefined, T] | [InstanceType<E>, undefined]>} A promise that resolves to a tuple.
 * - `[undefined, T]` if the promise resolves successfully.
 * - `[InstanceType<E>, undefined]` if the promise is rejected with an error matching `errorsToCatch`.
 *
 * @throws If the promise is rejected with an error not listed in `errorsToCatch`, the error is re-thrown.
 *
 * @example
 * const [error, data] = await goCatch(promise)
 * if (error) {
 *   console.error('An error occurred:', error)
 * }
 */
export default async function goCatch<
  T, E extends new (message?: string) => Error
>(
  promise: Promise<T>,
  errorsToCatch?: E[] | E
): Promise<[undefined, T] | [InstanceType<E>, undefined]> {
  try {
      const data = await promise;
      return [undefined, data] as [undefined, T];
  } catch (error) {
    if (!errorsToCatch) {
      return [error, undefined] as [InstanceType<E>, undefined];
    }

    if (!Array.isArray(errorsToCatch)) {
      errorsToCatch = [errorsToCatch];
    }

    if (Array.isArray(errorsToCatch) && errorsToCatch.some((E) => error instanceof E)) {
      return [error, undefined] as [InstanceType<E>, undefined];
    }

    throw error;
  }
}
