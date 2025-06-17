/**
 * Creates a `$sort` aggregation stage to sort documents.
 *
 * @param sortSpec - The specification for the `$sort` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = sortStage({
 *   name: 1
 * });
 * ```
 */
export function sortStage<T>(sortSpec: Partial<Record<keyof T, 1 | -1>>) {
  return { $sort: sortSpec };
}
