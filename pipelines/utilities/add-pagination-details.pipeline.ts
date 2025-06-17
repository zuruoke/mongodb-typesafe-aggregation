import { PipelineStage } from 'mongoose';

/**
 * Creates a MongoDB aggregation pipeline stage that adds pagination details to the query results.
 * This pipeline uses $facet to return both the total count of documents and the paginated data in a single query.
 *
 * @param {number} page - The current page number (1-based indexing)
 * @param {number} limit - The maximum number of items to return per page
 * @returns {PipelineStage} A MongoDB pipeline stage that:
 *   - Calculates the total count of documents in the collection
 *   - Returns the paginated subset of documents based on the page and limit parameters
 *
 * @example
 * ```typescript
 * const pipeline = addPaginationDetailsPipeline(1, 10);
 * // Result will have shape: { totalCount: [{ count: number }], data: Document[] }
 * ```
 */
export const addPaginationDetailsPipeline = (
  page: number,
  limit: number,
): PipelineStage => ({
  $facet: {
    totalCount: [{ $count: 'count' }],
    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
  },
});
