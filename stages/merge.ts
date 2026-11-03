/**
 * Defines the specification for a `$merge` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface MergeSpec<T> {
  into: string;
  on?: string | string[];
  let?: Record<string, T>;
  /** An action, or an update pipeline to apply to the matched document. */
  whenMatched?: 'replace' | 'keepExisting' | 'merge' | 'fail' | Record<string, unknown>[];
  whenNotMatched?: 'insert' | 'discard' | 'fail';
}

/**
 * Creates a `$merge` aggregation stage to merge documents from one collection into another.
 *
 * @param spec - The specification for the `$merge` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = mergeStage({
 *   into: "mergedCollection",
 *   on: "userId"
 * });
 * ```
 */
export function mergeStage<T>(spec: MergeSpec<T>) {
  return { $merge: spec };
}
