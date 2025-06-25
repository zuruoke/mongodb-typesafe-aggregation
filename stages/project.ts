/**
 * Defines the specification for a `$project` aggregation stage in MongoDB.
 *
 * @template T - The type of the value to store in each field.
 */
export type ProjectField = 0 | 1 | boolean | { [key: string]: any };

export interface ProjectSpec<T> {
  [key: string]: ProjectField;
}

/**
 * Creates a `$project` aggregation stage to include or exclude fields from the output documents.
 *
 * @param spec - The specification for the `$project` stage.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = projectStage({
 *   name: 1,
 *   age: 1
 * });
 * ```
 */
export function projectStage<T>(spec: ProjectSpec<T>) {
  return { $project: spec };
}