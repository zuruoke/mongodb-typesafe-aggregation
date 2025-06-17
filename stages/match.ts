import { MatchFilter } from '../../types';

/**
 * Creates a `$match` aggregation stage to filter documents based on a specified condition.
 *
 * @param filter - The filter condition to apply to the documents.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = matchStage({
 *   status: "active"
 * });
 * ```
 */
export function matchStage<T>(filter: MatchFilter<T>) {
  return { $match: filter };
}
