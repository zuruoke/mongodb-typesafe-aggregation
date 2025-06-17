/**
 * Defines the specification for a `$unionWith` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface UnionWithSpec<T> {
  coll: string;
  pipeline?: T[];
}

/**
 * Creates a `$unionWith` aggregation stage to combine documents from two collections.
 *
 * @param spec - The specification for the `$unionWith` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = unionWithStage({
 *   coll: "collection2"
 * });
 * ```
 */
export function unionWithStage<T>(spec: UnionWithSpec<T>) {
  return { $unionWith: spec };
}
