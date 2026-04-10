# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-01

### Added

#### Pipeline Builder

- `PipelineBuilder<T>` — fluent, type-safe class for constructing MongoDB aggregation pipelines
- `.build()` — returns the final `PipelineStage[]` array
- `.raw(stage)` — escape hatch for adding any arbitrary stage

#### Pipeline Stages

| Method               | MongoDB Stage  | Description                           |
| -------------------- | -------------- | ------------------------------------- |
| `.match(filter)`     | `$match`       | Filter documents                      |
| `.lookup(spec)`      | `$lookup`      | Join from another collection          |
| `.group(spec)`       | `$group`       | Group and accumulate                  |
| `.addFields(spec)`   | `$addFields`   | Add computed fields                   |
| `.set(spec)`         | `$set`         | Alias for `$addFields` (MongoDB 4.2+) |
| `.project(spec)`     | `$project`     | Include/exclude/reshape fields        |
| `.unset(fields)`     | `$unset`       | Remove fields                         |
| `.sort(spec)`        | `$sort`        | Sort documents                        |
| `.skip(n)`           | `$skip`        | Skip N documents                      |
| `.limit(n)`          | `$limit`       | Limit to N documents                  |
| `.unwind(spec)`      | `$unwind`      | Deconstruct an array field            |
| `.replaceRoot(spec)` | `$replaceRoot` | Replace root document                 |
| `.count(field)`      | `$count`       | Count matching documents              |
| `.facet(spec)`       | `$facet`       | Multi-faceted aggregation             |
| `.unionWith(spec)`   | `$unionWith`   | Union with another collection         |
| `.graphLookup(spec)` | `$graphLookup` | Recursive graph traversal             |
| `.bucket(spec)`      | `$bucket`      | Categorise into buckets               |
| `.bucketAuto(spec)`  | `$bucketAuto`  | Auto-distribute into buckets          |
| `.redact(spec)`      | `$redact`      | Conditionally include/exclude fields  |
| `.merge(spec)`       | `$merge`       | Write results to another collection   |

#### FilterOperator

`FilterOperator<T>` — type-safe builder for MongoDB query and expression operators:

| Method                   | Operator  | Description                                |
| ------------------------ | --------- | ------------------------------------------ |
| `.eq(value)`             | `$eq`     | Equal                                      |
| `.ne(value)`             | `$ne`     | Not equal                                  |
| `.gt(value)`             | `$gt`     | Greater than                               |
| `.gte(value)`            | `$gte`    | Greater than or equal                      |
| `.lt(value)`             | `$lt`     | Less than                                  |
| `.lte(value)`            | `$lte`    | Less than or equal                         |
| `.in(values)`            | `$in`     | In array                                   |
| `.nin(values)`           | `$nin`    | Not in array                               |
| `.all(values)`           | `$all`    | All values present                         |
| `.size(n)`               | `$size`   | Array size                                 |
| `.exists(bool)`          | `$exists` | Field existence check                      |
| `.regex(pattern)`        | `$regex`  | Regular expression match                   |
| `.fieldEq(field, value)` | `$eq`     | Field equality expression (for conditions) |
| `.fieldNe(field, value)` | `$ne`     | Field inequality expression                |
| `.cond(if, then, else)`  | `$cond`   | Conditional expression                     |

Also exports a `filter<T>()` factory function as a concise alternative to `new FilterOperator<T>()`.

[1.0.0]: https://github.com/zuruoke/mongodb-typesafe-aggregation/releases/tag/v1.0.0
