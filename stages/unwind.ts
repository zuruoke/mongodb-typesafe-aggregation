/**
 * Defines the specification for a `$unwind` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface UnwindSpec<T> {
  path: string;
  includeArrayIndex?: string;
  preserveNullAndEmptyArrays?: boolean;
}

/**
 * Creates a `$unwind` aggregation stage to unwind an array field from the input documents to output a document for each element.
 *
 * @param spec - The specification for the `$unwind` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = unwindStage("arrayField");
 * ```
 */
export function unwindStage<T>(spec: string | UnwindSpec<T>) {
  if (typeof spec === 'string') {
    return { $unwind: spec };
  }
  return { $unwind: spec };
}
