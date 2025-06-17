/**
 * Defines the specification for a `$group` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface GroupSpec<T> {
  [key: string]: T;
}

/**
 * Creates a `$group` aggregation stage to group documents by a specified field or expression.
 *
 * @param spec - The specification for the `$group` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = groupStage({
 *   _id: "$category",
 *   totalSales: { $sum: "$sales" }
 * });
 * ```
 */
export function groupStage<T>(spec: GroupSpec<T>) {
  return { $group: spec };
}
