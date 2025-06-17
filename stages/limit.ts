/**
 * Creates a `$limit` aggregation stage to limit the number of documents processed.
 *
 * @param count - The number of documents to limit the pipeline to.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = limitStage(10);
 * ```
 */

export function limitStage(count: number) {
  return { $limit: count };
}
