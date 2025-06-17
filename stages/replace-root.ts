/**
 * Defines the specification for a `$replaceRoot` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface ReplaceRootSpec<T> {
  newRoot: T;
}

/**
 * Creates a `$replaceRoot` aggregation stage to replace the root document with a new document.
 *
 * @param spec - The specification for the `$replaceRoot` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = replaceRootStage({
 *   newRoot: { name: "$name", age: "$age" }
 * });
 * ```
 */
export function replaceRootStage<T>(spec: ReplaceRootSpec<T>) {
  return { $replaceRoot: spec };
}
