/**
 * Configuration for a `$bucket` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to group by (e.g., number, string).
 */
export interface BucketSpec<T> {
  /**
   * Field or expression to group documents by.
   * For example, "$age" to group by the 'age' field.
   */
  groupBy: T;

  /**
   * Array defining the boundaries of the buckets.
   * Documents are grouped into buckets based on these boundaries.
   * For example, [0, 18, 35, 50, 100] creates age ranges: 0-17, 18-34, 35-49, 50-99, 100+.
   */
  boundaries: T[];

  /**
   * Optional value for documents that fall outside the defined boundaries.
   * If not specified, such documents are excluded from the buckets.
   */
  default?: T;

  /**
   * Optional fields to include in each bucket's output.
   * For example, to count documents in each bucket:
   * output: { count: { $sum: 1 } }
   */
  output?: Record<string, T>;
}

/**
 * Creates a `$bucket` aggregation stage for grouping documents into buckets based on a specified field.
 *
 * @param spec - Configuration for the `$bucket` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = bucketStage({
 *   groupBy: "$age",
 *   boundaries: [0, 18, 35, 50, 100],
 *   default: "Unknown",
 *   output: {
 *     count: { $sum: 1 },
 *     avgAge: { $avg: "$age" }
 *   }
 * });
 * ```
 */
export function bucketStage<T>(spec: BucketSpec<T>) {
  return { $bucket: spec };
}
