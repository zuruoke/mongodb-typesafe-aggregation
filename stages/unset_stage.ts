/**
 * Creates a `$unset` aggregation stage to remove fields from documents.
 *
 * @param fields - The fields to remove from each document.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = unsetStage(["field1", "field2"]);
 * ```
 */
export function unsetStage(fields: string | string[]) {
  return { $unset: fields };
}
