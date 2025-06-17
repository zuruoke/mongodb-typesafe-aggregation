/**
 * Defines the specification for a `$redact` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface RedactSpec<T> {
  [key: string]: T;
}

/**
 * Creates a `$redact` aggregation stage to redact fields from documents.
 *
 * @param spec - The specification for the `$redact` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = redactStage({
 *   name: 1,
 *   age: 1
 * });
 * ```
 */

export function redactStage<T>(spec: RedactSpec<T>) {
  return { $redact: spec };
}
