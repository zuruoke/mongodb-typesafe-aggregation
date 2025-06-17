/**
 * Creates a `$skip` aggregation stage to skip the first N documents.
 *
 * @param count - The number of documents to skip.
 * @returns A MongoDB aggregation stage object.
 */
export function skipStage(count: number) {
  return { $skip: count };
}
