# mongodb-typesafe-aggregation

[![npm version](https://img.shields.io/npm/v/mongodb-typesafe-aggregation.svg)](https://www.npmjs.com/package/mongodb-typesafe-aggregation)
[![CI](https://github.com/zuruoke/mongodb-typesafe-aggregation/actions/workflows/ci.yml/badge.svg)](https://github.com/zuruoke/mongodb-typesafe-aggregation/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A type-safe, fluent builder for MongoDB aggregation pipelines. Build complex aggregations with full TypeScript autocomplete and compile-time error checking — no more fragile raw JSON blobs.

## Installation

```bash
npm install mongodb-typesafe-aggregation
```

> **Peer dependency:** requires `mongoose >= 7`.

## Quick Start

```ts
import { PipelineBuilder } from 'mongodb-typesafe-aggregation/builder';
import { filter } from 'mongodb-typesafe-aggregation/types/filter';

interface Order {
  _id: string;
  status: 'pending' | 'completed';
  total: number;
  customerId: string;
}

const pipeline = new PipelineBuilder<Order>()
  .match({ status: filter<string>().eq('pending').build() })
  .sort({ total: -1 })
  .limit(20)
  .build();

// Pass to your collection
const results = await db.collection<Order>('orders').aggregate(pipeline).toArray();
```

## Why

Raw aggregation pipelines have no type safety:

```ts
// Before — easy to mistype, no autocomplete, fails only at runtime
[
  { $match: { satuts: 'pending' } },
  {
    $addFields: {
      isLate: { $cond: { if: { $gt: ['$dueDate', new Date()] }, then: true, else: false } },
    },
  },
];
```

With `mongodb-typesafe-aggregation`:

```ts
// After — typos caught at compile time, full autocomplete
new PipelineBuilder<Order>()
  .match({ status: filter<string>().eq('pending').build() })
  .addFields({
    isLate: filter<boolean>()
      .cond({ $gt: ['$dueDate', new Date()] }, { $literal: true }, false)
      .build(),
  })
  .build();
```

## API Reference

### PipelineBuilder\<T\>

Import:

```ts
import { PipelineBuilder } from 'mongodb-typesafe-aggregation/builder';
```

All methods return `this` (for same-type stages) or a new `PipelineBuilder` instance (for stages that change the document shape). Call `.build()` at the end to get the `PipelineStage[]` array.

#### Stage methods

| Method               | MongoDB Stage  | Notes                                    |
| -------------------- | -------------- | ---------------------------------------- |
| `.match(filter)`     | `$match`       | Accepts `FilterOperator` values          |
| `.lookup(spec)`      | `$lookup`      | Returns `PipelineBuilder<T & U>`         |
| `.group(spec)`       | `$group`       | Returns `PipelineBuilder<G>`             |
| `.addFields(spec)`   | `$addFields`   | Returns `PipelineBuilder<T & U>`         |
| `.set(spec)`         | `$set`         | Alias for `$addFields` (Mongo 4.2+)      |
| `.project(spec)`     | `$project`     | Returns `PipelineBuilder<G>`             |
| `.unset(fields)`     | `$unset`       | Accepts `string` or `string[]`           |
| `.sort(spec)`        | `$sort`        | Keys must be `keyof T`                   |
| `.skip(n)`           | `$skip`        |                                          |
| `.limit(n)`          | `$limit`       |                                          |
| `.unwind(spec)`      | `$unwind`      | Accepts `string` path or `UnwindSpec`    |
| `.replaceRoot(spec)` | `$replaceRoot` | Returns `PipelineBuilder<G>`             |
| `.count(fieldName)`  | `$count`       | Returns `PipelineBuilder<{[k]: number}>` |
| `.facet(spec)`       | `$facet`       | Returns `PipelineBuilder<G>`             |
| `.unionWith(spec)`   | `$unionWith`   |                                          |
| `.graphLookup(spec)` | `$graphLookup` |                                          |
| `.bucket(spec)`      | `$bucket`      |                                          |
| `.bucketAuto(spec)`  | `$bucketAuto`  |                                          |
| `.redact(spec)`      | `$redact`      |                                          |
| `.merge(spec)`       | `$merge`       | Terminal — write to another collection   |
| `.raw(stage)`        | any            | Escape hatch for unsupported stages      |
| `.build()`           | —              | Returns the `PipelineStage[]` array      |

### FilterOperator\<T\>

Import:

```ts
import { FilterOperator, filter } from 'mongodb-typesafe-aggregation/types/filter';

// These two are equivalent
new FilterOperator<number>().gt(100).build();
filter<number>().gt(100).build();
```

#### Comparison

| Method        | Operator |
| ------------- | -------- |
| `.eq(value)`  | `$eq`    |
| `.ne(value)`  | `$ne`    |
| `.gt(value)`  | `$gt`    |
| `.gte(value)` | `$gte`   |
| `.lt(value)`  | `$lt`    |
| `.lte(value)` | `$lte`   |

#### Array

| Method         | Operator |
| -------------- | -------- |
| `.in(values)`  | `$in`    |
| `.nin(values)` | `$nin`   |
| `.all(values)` | `$all`   |
| `.size(n)`     | `$size`  |

#### Element & string

| Method            | Operator  |
| ----------------- | --------- |
| `.exists(bool)`   | `$exists` |
| `.regex(pattern)` | `$regex`  |

#### Expression helpers

| Method                   | Operator | Use case                           |
| ------------------------ | -------- | ---------------------------------- |
| `.fieldEq(field, value)` | `$eq`    | `[$field, value]` form for `$cond` |
| `.fieldNe(field, value)` | `$ne`    | `[$field, value]` form for `$cond` |
| `.cond(if, then, else)`  | `$cond`  | Ternary expression                 |

Methods can be chained. Multiple comparison operators on the same instance produce a combined object:

```ts
filter<number>().gte(100).lte(999).build();
// → { $gte: 100, $lte: 999 }
```

## Examples

### `$match` with multiple operators

```ts
new PipelineBuilder<Product>()
  .match({
    price: filter<number>().gte(100).lte(999).build(),
    category: filter<string>().in(['electronics', 'furniture']).build(),
    stock: filter<number>().exists(true).build(),
  })
  .build();
```

### `$lookup` + `$addFields` + `$project`

```ts
new PipelineBuilder<Product>()
  .lookup({ from: 'orders', localField: '_id', foreignField: 'productId', as: 'orders' })
  .addFields({
    orderedQuantity: { $sum: '$orders.quantity' },
    remainingStock: { $subtract: ['$stock', { $sum: '$orders.quantity' }] },
  })
  .project({ _id: 0, name: 1, remainingStock: 1 })
  .build();
```

### `$group`

```ts
new PipelineBuilder<Order>()
  .group({ _id: '$status', totalOrders: { $sum: 1 }, totalQty: { $sum: '$quantity' } })
  .sort({ _id: 1 })
  .build();
```

### Conditional field with `$cond`

```ts
new PipelineBuilder<Product>()
  .addFields({
    isExpensive: filter<boolean>()
      .cond({ $gt: ['$price', 500] }, { $literal: true }, false)
      .build(),
  })
  .build();
```

### `$facet`

```ts
new PipelineBuilder<Product>()
  .facet({
    expensive: [{ $match: { price: { $gte: 700 } } }],
    lowStock: [{ $match: { stock: { $lt: 20 } } }],
  })
  .build();
```

### `$graphLookup`

```ts
new PipelineBuilder<Product>()
  .graphLookup({
    from: 'products',
    startWith: '$relatedIds',
    connectFromField: 'relatedIds',
    connectToField: '_id',
    as: 'relatedProducts',
    maxDepth: 2,
  })
  .build();
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

[MIT](LICENSE)
