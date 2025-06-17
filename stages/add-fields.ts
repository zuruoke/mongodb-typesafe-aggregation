/**
 * Defines the fields to add to documents in a `$addFields` aggregation stage.
 *
 * @template T - The type of the value to assign to each field.
 */
export interface AddFieldsSpec<T> {
  [key: string]: T;
}

/**
 * Creates a `$addFields` aggregation stage to add new fields to documents.
 *
 * @param spec - The fields to add to each document.
 * @returns A MongoDB aggregation stage object.
 *
 * @example
 * ```ts
 * const stage = addFieldsStage({
 *   fullName: { $concat: ["$firstName", " ", "$lastName"] },
 *   isActive: true
 * });
 * ```
 */
export function addFieldsStage<T>(spec: AddFieldsSpec<T>) {
  return { $addFields: spec };
}
