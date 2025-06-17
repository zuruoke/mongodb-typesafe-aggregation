/**
 * Defines the specification for a `$facet` aggregation stage in MongoDB.
 *
 * @template T - The type of the aggregation stages.
 */
export interface FacetSpec<T> {
  [key: string]: T;
}

/**
 * Creates a `$facet` aggregation stage to perform multiple aggregations within a single stage.
 *
 * @param spec - An object where each key is the name of an output field, and the value is an array of aggregation stages.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = facetStage({
 *   salesAnalysis: [
 *     { $unwind: "$sales" },
 *     { $match: { "sales.category": "Electronics" } },
 *     { $group: { _id: "$sales.region", totalSales: { $sum: "$sales.amount" } } }
 *   ],
 *   promotionAnalysis: [
 *     { $unwind: "$promotions" },
 *     { $match: { "promotions.category": "Electronics" } },
 *     { $group: { _id: "$promotions.region", avgDiscount: { $avg: "$promotions.discount" } } }
 *   ]
 * });
 * ```
 */
export function facetStage<T>(spec: FacetSpec<T>) {
  return { $facet: spec };
}
