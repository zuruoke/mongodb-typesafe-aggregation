/**
 * Defines the specification for a filter operator in MongoDB.
 * This is a more type-safe and declarative approach to building MongoDB filter operators.
 */
export class FilterOperator<T> {
  private operator: Record<string, unknown> = {};

  /**
   * Creates an equality filter operator.
   * @param value - The value to compare against
   */
  eq(value: T): this {
    this.operator['$eq'] = value;
    return this;
  }

  /**
   * Creates a field equality expression for use in conditions.
   * @param field - The field to compare
   * @param value - The value to compare against
   */
  fieldEq(field: string, value: T): this {
    this.operator['$eq'] = [field, value];
    return this;
  }

  /**
   * Creates a conditional filter operator.
   * @param condition - The condition to evaluate
   * @param thenValue - The value to return if condition is true
   * @param elseValue - The value to return if condition is false
   */
  cond(
    condition: Record<string, unknown>,
    thenValue: Record<string, unknown>,
    elseValue: T
  ): this {
    this.operator['$cond'] = {
      if: condition,
      then: thenValue,
      else: elseValue,
    };
    return this;
  }

  /**
   * Creates a greater than filter operator.
   * @param value - The value to compare against
   */
  gt(value: T): this {
    this.operator['$gt'] = value;
    return this;
  }

  /**
   * Creates a greater than or equal to filter operator.
   * @param value - The value to compare against
   */
  gte(value: T): this {
    this.operator['$gte'] = value;
    return this;
  }

  /**
   * Creates a less than filter operator.
   * @param value - The value to compare against
   */
  lt(value: T): this {
    this.operator['$lt'] = value;
    return this;
  }

  /**
   * Creates a less than or equal to filter operator.
   * @param value - The value to compare against
   */
  lte(value: T): this {
    this.operator['$lte'] = value;
    return this;
  }

  /**
   * Creates an in array filter operator.
   * @param values - The array of values to match against
   */
  in(values: T[]): this {
    this.operator['$in'] = values;
    return this;
  }

  /**
   * Creates a not in array filter operator.
   * @param values - The array of values to not match against
   */
  nin(values: T[]): this {
    this.operator['$nin'] = values;
    return this;
  }

  /**
   * Creates a not equal filter operator.
   * @param value - The value to compare against
   */
  ne(value: T): this {
    this.operator['$ne'] = value;
    return this;
  }

  /**
   * Creates a field not equal expression for use in conditions.
   * @param field - The field to compare
   * @param value - The value to compare against
   */
  fieldNe(field: string, value: T): this {
    this.operator['$ne'] = [field, value];
    return this;
  }

  /**
   * Creates a regex filter operator.
   * @param pattern - The regex pattern to match against
   */
  regex(pattern: string): this {
    this.operator['$regex'] = pattern;
    return this;
  }

  /**
   * Creates an exists filter operator.
   * @param exists - Whether the field should exist
   */
  exists(exists: boolean): this {
    this.operator['$exists'] = exists;
    return this;
  }

  /**
   * Creates an all array filter operator.
   * @param values - The array of values that must all be present
   */
  all(values: T[]): this {
    this.operator['$all'] = values;
    return this;
  }

  /**
   * Creates a size filter operator.
   * @param size - The expected size of the array
   */
  size(size: number): this {
    this.operator['$size'] = size;
    return this;
  }

  /**
   * Builds the final filter operator object.
   */
  build(): Record<string, unknown> {
    return this.operator;
  }
}

/**
 * Creates a new filter operator builder.
 * @template T - The type of the value to filter by
 */
export function filter<T>(): FilterOperator<T> {
  return new FilterOperator<T>();
}

/**
 * Defines the specification for a match filter in MongoDB.
 * @template T - The type of the value to filter by
 */
export type MatchFilter<T> = {
  [P in keyof T]?: T[P] | FilterOperator<T[P]> | Record<string, unknown>;
};
