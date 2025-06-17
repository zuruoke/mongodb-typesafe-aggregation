import { PipelineStage } from 'mongoose';

/**
 * Defines the specification for a `$lookup` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export interface LookupSpec<T> {
  from: string;
  localField?: string;
  foreignField?: string;
  as: string;
  let?: Record<string, T>;
  pipeline?: PipelineStage[];
}

/**
 * Creates a `$lookup` aggregation stage to perform a left outer join with another collection.
 *
 * @param spec - The specification for the `$lookup` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = lookupStage({
 *   from: "users",
 *   localField: "userId",
 *   foreignField: "userId",
 *   as: "userDetails"
 * });
 * ```
 */
export function lookupStage<T>(spec: LookupSpec<T>) {
  return { $lookup: spec };
}
