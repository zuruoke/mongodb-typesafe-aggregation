/**
 * Defines the specification for a `$graphLookup` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface GraphLookupSpec<T> {
  from: string;
  startWith: T;
  connectFromField: string;
  connectToField: string;
  as: string;
  maxDepth?: number;
  depthField?: string;
  restrictSearchWithMatch?: Record<string, T>;
}

/**
 * Creates a `$graphLookup` aggregation stage to perform a recursive search within a collection.
 *
 * @param spec - The specification for the `$graphLookup` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = graphLookupStage({
 *   from: "users",
 *   startWith: "$managerId",
 *   connectFromField: "managerId",
 *   connectToField: "employeeId",
 *   as: "subordinates",
 *   maxDepth: 2
 * });
 * ```
 */
export function graphLookupStage<T>(spec: GraphLookupSpec<T>) {
  return { $graphLookup: spec };
}
