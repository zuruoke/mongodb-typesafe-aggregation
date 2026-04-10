import { matchStage } from '../stages/match';
import { lookupStage } from '../stages/lookup';
import { groupStage } from '../stages/group';
import { addFieldsStage } from '../stages/add-fields';
import { projectStage } from '../stages/project';
import { sortStage } from '../stages/sort';
import { skipStage } from '../stages/skip';
import { limitStage } from '../stages/limit';
import { unwindStage } from '../stages/unwind';
import { replaceRootStage } from '../stages/replace-root';
import { countStage } from '../stages/count';
import { unionWithStage } from '../stages/union-with';
import { setStage } from '../stages/set-stage';
import { unsetStage } from '../stages/unset_stage';
import { mergeStage } from '../stages/merge';
import { graphLookupStage } from '../stages/graph-lookup';
import { bucketStage } from '../stages/bucket';
import { bucketAutoStage } from '../stages/bucket-auto';
import { redactStage } from '../stages/redact';
import { facetStage } from '../stages/facet';

describe('Stage builders', () => {
  it('matchStage wraps filter in $match', () => {
    expect(matchStage({ status: 'active' })).toEqual({ $match: { status: 'active' } });
  });

  it('lookupStage wraps spec in $lookup', () => {
    const spec = { from: 'orders', localField: '_id', foreignField: 'productId', as: 'orders' };
    expect(lookupStage(spec)).toEqual({ $lookup: spec });
  });

  it('groupStage wraps spec in $group', () => {
    const spec = { _id: '$category', total: { $sum: 1 } };
    expect(groupStage(spec)).toEqual({ $group: spec });
  });

  it('addFieldsStage wraps spec in $addFields', () => {
    const spec = { computed: { $sum: '$items' } };
    expect(addFieldsStage(spec)).toEqual({ $addFields: spec });
  });

  it('projectStage wraps spec in $project', () => {
    const spec: import('../stages/project').ProjectSpec<unknown> = {
      _id: 0 as const,
      name: 1 as const,
    };
    expect(projectStage(spec)).toEqual({ $project: spec });
  });

  it('sortStage wraps spec in $sort', () => {
    expect(sortStage({ price: -1 })).toEqual({ $sort: { price: -1 } });
  });

  it('skipStage wraps count in $skip', () => {
    expect(skipStage(10)).toEqual({ $skip: 10 });
  });

  it('limitStage wraps count in $limit', () => {
    expect(limitStage(5)).toEqual({ $limit: 5 });
  });

  describe('unwindStage', () => {
    it('accepts a string path', () => {
      expect(unwindStage('$items')).toEqual({ $unwind: '$items' });
    });

    it('accepts an object spec', () => {
      const spec = { path: '$items', preserveNullAndEmptyArrays: true };
      expect(unwindStage(spec)).toEqual({ $unwind: spec });
    });
  });

  it('replaceRootStage wraps newRoot in $replaceRoot', () => {
    const spec = { newRoot: { label: '$name' } };
    expect(replaceRootStage(spec)).toEqual({ $replaceRoot: spec });
  });

  it('countStage wraps fieldName in $count', () => {
    expect(countStage('total')).toEqual({ $count: 'total' });
  });

  it('unionWithStage wraps spec in $unionWith', () => {
    const spec = { coll: 'archived_products', pipeline: [] };
    expect(unionWithStage(spec)).toEqual({ $unionWith: spec });
  });

  it('setStage wraps spec in $set', () => {
    const spec = { isActive: true };
    expect(setStage(spec)).toEqual({ $set: spec });
  });

  describe('unsetStage', () => {
    it('accepts a single string field', () => {
      expect(unsetStage('password')).toEqual({ $unset: 'password' });
    });

    it('accepts an array of fields', () => {
      expect(unsetStage(['password', 'token'])).toEqual({ $unset: ['password', 'token'] });
    });
  });

  it('mergeStage wraps spec in $merge', () => {
    const spec = { into: 'summary', whenMatched: 'replace', whenNotMatched: 'insert' } as const;
    expect(mergeStage(spec)).toEqual({ $merge: spec });
  });

  it('graphLookupStage wraps spec in $graphLookup', () => {
    const spec = {
      from: 'employees',
      startWith: '$managerId',
      connectFromField: 'managerId',
      connectToField: '_id',
      as: 'reports',
    };
    expect(graphLookupStage(spec)).toEqual({ $graphLookup: spec });
  });

  it('bucketStage wraps spec in $bucket', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spec: import('../stages/bucket').BucketSpec<any> = {
      groupBy: '$price',
      boundaries: [0, 100, 500],
      default: 'other',
    };
    expect(bucketStage(spec)).toEqual({ $bucket: spec });
  });

  it('bucketAutoStage wraps spec in $bucketAuto', () => {
    const spec = { groupBy: '$price', buckets: 4 };
    expect(bucketAutoStage(spec)).toEqual({ $bucketAuto: spec });
  });

  it('redactStage wraps spec in $redact', () => {
    const spec = { $cond: { if: { $eq: ['$level', 5] }, then: '$$DESCEND', else: '$$PRUNE' } };
    expect(redactStage(spec)).toEqual({ $redact: spec });
  });

  it('facetStage wraps spec in $facet', () => {
    const spec = {
      byCategory: [{ $group: { _id: '$category' } }],
    };
    expect(facetStage(spec)).toEqual({ $facet: spec });
  });
});
