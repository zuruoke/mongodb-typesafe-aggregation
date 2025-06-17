/**
 * Creates a `$count` aggregation stage to count the number of documents.
 *
 * @param fieldName - The name of the field to store the count result.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = countStage("totalDocuments");
 * ```
 */
export function countStage(fieldName: string) {
  return { $count: fieldName };
}
