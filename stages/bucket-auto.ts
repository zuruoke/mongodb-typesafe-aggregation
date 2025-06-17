/**
 * Defines the specification for a `$bucketAuto` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to group by (e.g., number, string).
 */
export interface BucketAutoSpec<T> {
  /**
   * The field or expression to group documents by.
   * For example, "$price" to group by the 'price' field.
   */
  groupBy: T;

  /**
   * The number of buckets to create.
   * MongoDB will automatically determine the boundaries to evenly distribute documents into these buckets.
   */
  buckets: number;

  /**
   * Optional fields to include in each bucket's output.
   * For example, to count documents in each bucket:
   * output: { count: { $sum: 1 } }
   */
  output?: Record<string, T>;

  /**
   * Optional granularity to specify the preferred number series for bucket boundaries.
   * For example, "E24" for a series of 1, 2, 4, 8, 16, 32, etc.
   */
  granularity?: string;
}

/**
 * Creates a `$bucketAuto` aggregation stage to group documents into a specified number of buckets.
 *
 * @param spec - Configuration for the `$bucketAuto` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = bucketAutoStage({
 *   groupBy: "$price",
 *   buckets: 5,
 *   output: {
 *     count: { $sum: 1 },
 *     avgPrice: { $avg: "$price" }
 *   }
 * });
 * ```
 */
export function bucketAutoStage<T>(spec: BucketAutoSpec<T>) {
  return { $bucketAuto: spec };
}
