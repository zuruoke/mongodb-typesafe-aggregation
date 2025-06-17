/**
 * $set is an alias of $addFields in MongoDB 4.2+
 */

/**
 * Defines the specification for a `$set` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface SetSpec<T> {
  [key: string]: T;
}

/**
 * Creates a `$set` aggregation stage to add new fields to documents.
 *
 * @param spec - The fields to add to each document.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = setStage({
 *   newField: "newValue"
 * });
 * ```
 */
export function setStage<T>(spec: SetSpec<T>) {
  return { $set: spec };
}
