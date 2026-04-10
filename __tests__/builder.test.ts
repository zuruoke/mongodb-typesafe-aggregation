import { PipelineBuilder } from '../builder';
import { FilterOperator } from '../types/filter';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  active: boolean;
}

interface Order {
  _id: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'completed';
}

describe('PipelineBuilder', () => {
  it('build() returns an empty array for a fresh builder', () => {
    expect(new PipelineBuilder<Product>().build()).toEqual([]);
  });

  it('accepts initial stages via constructor', () => {
    const initial = [{ $limit: 5 }] as any[];
    const result = new PipelineBuilder<Product>(initial).build();
    expect(result).toEqual([{ $limit: 5 }]);
  });

  describe('match()', () => {
    it('adds a $match stage', () => {
      const pipeline = new PipelineBuilder<Product>().match({ category: 'electronics' }).build();
      expect(pipeline).toEqual([{ $match: { category: 'electronics' } }]);
    });

    it('supports FilterOperator values', () => {
      const pipeline = new PipelineBuilder<Product>()
        .match({ price: new FilterOperator<number>().gt(500).build() })
        .build();
      expect(pipeline).toEqual([{ $match: { price: { $gt: 500 } } }]);
    });
  });

  describe('sort()', () => {
    it('adds a $sort stage', () => {
      const pipeline = new PipelineBuilder<Product>().sort({ price: -1 }).build();
      expect(pipeline).toEqual([{ $sort: { price: -1 } }]);
    });
  });

  describe('skip()', () => {
    it('adds a $skip stage', () => {
      const pipeline = new PipelineBuilder<Product>().skip(10).build();
      expect(pipeline).toEqual([{ $skip: 10 }]);
    });
  });

  describe('limit()', () => {
    it('adds a $limit stage', () => {
      const pipeline = new PipelineBuilder<Product>().limit(5).build();
      expect(pipeline).toEqual([{ $limit: 5 }]);
    });
  });

  describe('lookup()', () => {
    it('adds a $lookup stage and returns a new builder', () => {
      const pipeline = new PipelineBuilder<Product>()
        .lookup({ from: 'orders', localField: '_id', foreignField: 'productId', as: 'orders' })
        .build();
      expect(pipeline).toEqual([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'productId',
            as: 'orders',
          },
        },
      ]);
    });
  });

  describe('addFields()', () => {
    it('adds an $addFields stage and returns a new builder', () => {
      const pipeline = new PipelineBuilder<Product>()
        .addFields({ computed: { $sum: '$items' } })
        .build();
      expect(pipeline).toEqual([{ $addFields: { computed: { $sum: '$items' } } }]);
    });
  });

  describe('set()', () => {
    it('adds a $set stage', () => {
      const pipeline = new PipelineBuilder<Product>().set({ label: 'test' }).build();
      expect(pipeline).toEqual([{ $set: { label: 'test' } }]);
    });
  });

  describe('unset()', () => {
    it('adds a $unset stage with a string', () => {
      const pipeline = new PipelineBuilder<Product>().unset('active').build();
      expect(pipeline).toEqual([{ $unset: 'active' }]);
    });

    it('adds a $unset stage with an array', () => {
      const pipeline = new PipelineBuilder<Product>().unset(['active', 'tags']).build();
      expect(pipeline).toEqual([{ $unset: ['active', 'tags'] }]);
    });
  });

  describe('project()', () => {
    it('adds a $project stage and returns a new builder', () => {
      const pipeline = new PipelineBuilder<Product>()
        .project({ _id: 0, name: 1, price: 1 })
        .build();
      expect(pipeline).toEqual([{ $project: { _id: 0, name: 1, price: 1 } }]);
    });
  });

  describe('group()', () => {
    it('adds a $group stage and returns a new builder', () => {
      const pipeline = new PipelineBuilder<any>()
        .group({ _id: '$status', total: { $sum: 1 } })
        .build();
      expect(pipeline).toEqual([{ $group: { _id: '$status', total: { $sum: 1 } } }]);
    });
  });

  describe('count()', () => {
    it('adds a $count stage and returns a new builder', () => {
      const pipeline = new PipelineBuilder<Order>()
        .match({ status: 'pending' })
        .count('pendingTotal')
        .build();
      expect(pipeline).toEqual([{ $match: { status: 'pending' } }, { $count: 'pendingTotal' }]);
    });
  });

  describe('unwind()', () => {
    it('adds a $unwind stage with a string path', () => {
      const pipeline = new PipelineBuilder<Product>().unwind('$tags').build();
      expect(pipeline).toEqual([{ $unwind: '$tags' }]);
    });

    it('adds a $unwind stage with an object spec', () => {
      const pipeline = new PipelineBuilder<Product>()
        .unwind({ path: '$tags', preserveNullAndEmptyArrays: true })
        .build();
      expect(pipeline).toEqual([{ $unwind: { path: '$tags', preserveNullAndEmptyArrays: true } }]);
    });
  });

  describe('replaceRoot()', () => {
    it('adds a $replaceRoot stage and returns a new builder', () => {
      const pipeline = new PipelineBuilder<any>()
        .replaceRoot({ newRoot: { label: '$name' } })
        .build();
      expect(pipeline).toEqual([{ $replaceRoot: { newRoot: { label: '$name' } } }]);
    });
  });

  describe('facet()', () => {
    it('adds a $facet stage and returns a new builder', () => {
      const pipeline = new PipelineBuilder<any>()
        .facet({ byCategory: [{ $group: { _id: '$category' } }] })
        .build();
      expect(pipeline).toEqual([{ $facet: { byCategory: [{ $group: { _id: '$category' } }] } }]);
    });
  });

  describe('unionWith()', () => {
    it('adds a $unionWith stage', () => {
      const pipeline = new PipelineBuilder<Product>()
        .unionWith({ coll: 'archived_products' })
        .build();
      expect(pipeline).toEqual([{ $unionWith: { coll: 'archived_products' } }]);
    });
  });

  describe('graphLookup()', () => {
    it('adds a $graphLookup stage', () => {
      const spec = {
        from: 'employees',
        startWith: '$managerId',
        connectFromField: 'managerId',
        connectToField: '_id',
        as: 'reports',
        maxDepth: 3,
      };
      const pipeline = new PipelineBuilder<any>().graphLookup(spec).build();
      expect(pipeline).toEqual([{ $graphLookup: spec }]);
    });
  });

  describe('bucket()', () => {
    it('adds a $bucket stage', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spec: import('../stages/bucket').BucketSpec<any> = {
        groupBy: '$price',
        boundaries: [0, 100, 500],
        default: 'other',
      };
      const pipeline = new PipelineBuilder<any>().bucket<any>(spec).build();
      expect(pipeline).toEqual([{ $bucket: spec }]);
    });
  });

  describe('bucketAuto()', () => {
    it('adds a $bucketAuto stage', () => {
      const spec = { groupBy: '$price', buckets: 4 };
      const pipeline = new PipelineBuilder<any>().bucketAuto(spec).build();
      expect(pipeline).toEqual([{ $bucketAuto: spec }]);
    });
  });

  describe('redact()', () => {
    it('adds a $redact stage', () => {
      const spec = { $cond: { if: { $eq: ['$active', true] }, then: '$$KEEP', else: '$$PRUNE' } };
      const pipeline = new PipelineBuilder<any>().redact(spec).build();
      expect(pipeline).toEqual([{ $redact: spec }]);
    });
  });

  describe('merge()', () => {
    it('adds a $merge stage', () => {
      const spec = { into: 'summary', whenMatched: 'replace' as const };
      const pipeline = new PipelineBuilder<Product>().merge(spec).build();
      expect(pipeline).toEqual([{ $merge: spec }]);
    });
  });

  describe('raw()', () => {
    it('adds an arbitrary raw stage', () => {
      const stage = { $sample: { size: 3 } } as any;
      const pipeline = new PipelineBuilder<Product>().raw(stage).build();
      expect(pipeline).toEqual([stage]);
    });
  });

  describe('chaining multiple stages', () => {
    it('preserves stage order', () => {
      const pipeline = new PipelineBuilder<Product>()
        .match({ active: true })
        .sort({ price: -1 })
        .skip(0)
        .limit(10)
        .build();

      expect(pipeline).toEqual([
        { $match: { active: true } },
        { $sort: { price: -1 } },
        { $skip: 0 },
        { $limit: 10 },
      ]);
    });
  });

  describe('immutability', () => {
    it('build() returns a new array each time', () => {
      const builder = new PipelineBuilder<Product>().match({ active: true });
      const a = builder.build();
      const b = builder.build();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });

    it('lookup() does not mutate the original builder', () => {
      const base = new PipelineBuilder<Product>().match({ active: true });
      base.lookup({ from: 'orders', localField: '_id', foreignField: 'productId', as: 'orders' });
      expect(base.build()).toEqual([{ $match: { active: true } }]);
    });
  });
});
