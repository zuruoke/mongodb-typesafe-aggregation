# 🛠 Aggregation Module Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [The Problem: Why Change Was Needed](#problem)
3. [The Solution: Fluent, Type-Safe Aggregations](#solution)
4. [Migration Guide: Step-by-Step](#migration)
5. [Mapping Old to New Patterns](#mapping)
6. [Before vs After: Real Examples](#examples)
7. [Best Practices](#best-practices)
8. [Directory Structure Overview](#structure)
9. [Further Reading](#further-reading)

## 📖 Introduction <a name="introduction"></a>

This module transforms how we build MongoDB aggregation pipelines. It provides a **type-safe**, **fluent**, and **maintainable** way to structure complex queries without worrying about fragile JSON blobs.

## ❌ The Problem: Why Change Was Needed <a name="problem"></a>

Old aggregation pipelines looked like this:

```ts
[
  { $match: { officeId: query.officeId } },
  {
    $addFields: {
      hasAccess: {
        $cond: { if: { $eq: ['$role', 'admin'] }, then: true, else: false },
      },
    },
  },
];
```

### Problems:

- Hard to read 😵
- No type hints 🧩
- Runtime-only errors 🚨
- Difficult to test 🧪

## ✅ The Solution: Fluent, Type-Safe Aggregations <a name="solution"></a>

Using `PipelineBuilder` and `filter()` operators:

```ts
new PipelineBuilder()
  .match({ officeId: query.officeId })
  .addFields({
    isAdmin: filter<boolean>()
      .cond(filter<string>().fieldEq('$role', 'admin').build(), true, false)
      .build(),
  })
  .build();
```

### 🔥 Advantages

- **Type-safe** pipelines at compile time.
- **Autocomplete** for fields and operators.
- **Readable and maintainable** structure.
- **Unit-testable** simple arrays.

## 🛠 Migration Guide: Step-by-Step <a name="migration"></a>

### 🔹 Step 1: Find Legacy Pipelines

Search for usage of `aggregate([...])` or raw `PipelineStage[]` arrays.

### 🔹 Step 2: Initialize a PipelineBuilder

```ts
const pipeline = new PipelineBuilder();
```

### 🔹 Step 3: Convert Each Stage Carefully

| MongoDB Stage | New Fluent Style                    |
| :------------ | :---------------------------------- |
| `$match`      | `.match({...})`                     |
| `$addFields`  | `.addFields({...})`                 |
| `$project`    | `.project({...})`                   |
| `$lookup`     | `.lookup({...})`                    |
| `$unwind`     | `.unwind('field') or unwind({...})` |

### 🔹 Step 4: Handle Conditional Logic

**Old Way:**

```ts
$cond: { if: { $eq: ['$role', 'admin'] }, then: true, else: false }
```

**New Way:**

```ts
filter<boolean>()
  .cond(filter<string>().fieldEq('$role', 'admin').build(), true, false)
  .build();
```

### 🔹 Step 5: Validate Output

- Snapshot the pipeline.
- Compare outputs with old version.
- Use unit tests.

## 🔥 Mapping Old to New Patterns <a name="mapping"></a>

| 🏛️ Old Pattern                               | 🚀 New Fluent Pattern                             |
| :------------------------------------------- | :------------------------------------------------ |
| `$match: { status: 'active' }`               | `.match({ status: 'active' })`                    |
| `$addFields: { total: { $sum: '$amount' } }` | `.addFields({ total: sum('$amount') })`           |
| `$lookup`                                    | `.lookup({ from, localField, foreignField, as })` |
| `$unwind: 'items'`                           | `.unwind('items')`                                |
| `$cond` expressions                          | `.addFields({ field: filter().cond(...) })`       |

## 🔥 Before vs After: Real Examples <a name="examples"></a>

### 🛑 Before (Old Style)

```ts
[
  { $match: { status: 'PENDING' } },
  {
    $addFields: {
      isLate: {
        $cond: {
          if: { $gt: ['$dueDate', new Date()] },
          then: true,
          else: false,
        },
      },
    },
  },
];
```

### 🚀 After (New Style)

```ts
new PipelineBuilder()
  .match({ status: 'PENDING' })
  .addFields({
    isLate: filter<boolean>()
      .cond(filter<Date>().fieldGt('$dueDate', new Date()).build(), true, false)
      .build(),
  })
  .build();
```

## 📦 Lookup Example <a name="lookup-example"></a>

### 👩‍💻 Old Way:

```ts
[
  {
    $lookup: {
      from: COLLECTION_NAMES.TRANSLATIONS,
      localField: '_id',
      foreignField: 'messageId',
      as: 'translation',
    },
  },
];
```

### 🚀 New Fluent Style:

```ts
new PipelineBuilder()
  .lookup({
    from: COLLECTION_NAMES.TRANSLATIONS,
    localField: '_id',
    foreignField: 'messageId',
    as: 'translation',
  })
  .build();
```

**Tip:** You can also include `pipeline` inside `lookup` if you need deeper filtering!

## ✍️ Best Practices <a name="best-practices"></a>

- **Prefer short, chainable stages.**
- **Use `filter()` instead of raw operators.**
- **Write helper functions** for repeated conditions.
- **Snapshot complex pipelines** during migration.
- **Comment non-trivial logic.**

## 📂 Directory Structure Overview <a name="structure"></a>

```bash
packages/src/aggregation/
├── builder.ts
├── constants.ts
├── stages/
├── types/
├── index.ts
```

## 📚 Further Reading <a name="further-reading"></a>

- [MongoDB Aggregation Framework – Official Docs](https://www.mongodb.com/docs/manual/aggregation/)
- [Aggregation Optimization in MongoDB (Case Study)](https://medium.com/mongodb/aggregation-optimization-in-mongodb-a-case-study-from-the-field-part-1-15aec13fe1bc)
- [Fluent Aggregation Builder (npm)](https://www.npmjs.com/package/mongodb-aggregation-builder)
