import { FilterOperator, filter } from '../types/filter';

describe('FilterOperator', () => {
  describe('comparison operators', () => {
    it('eq() builds $eq operator', () => {
      expect(new FilterOperator<number>().eq(42).build()).toEqual({ $eq: 42 });
    });

    it('ne() builds $ne operator', () => {
      expect(new FilterOperator<string>().ne('inactive').build()).toEqual({ $ne: 'inactive' });
    });

    it('gt() builds $gt operator', () => {
      expect(new FilterOperator<number>().gt(100).build()).toEqual({ $gt: 100 });
    });

    it('gte() builds $gte operator', () => {
      expect(new FilterOperator<number>().gte(100).build()).toEqual({ $gte: 100 });
    });

    it('lt() builds $lt operator', () => {
      expect(new FilterOperator<number>().lt(500).build()).toEqual({ $lt: 500 });
    });

    it('lte() builds $lte operator', () => {
      expect(new FilterOperator<number>().lte(500).build()).toEqual({ $lte: 500 });
    });
  });

  describe('array operators', () => {
    it('in() builds $in operator', () => {
      expect(new FilterOperator<string>().in(['a', 'b']).build()).toEqual({ $in: ['a', 'b'] });
    });

    it('nin() builds $nin operator', () => {
      expect(new FilterOperator<string>().nin(['x', 'y']).build()).toEqual({ $nin: ['x', 'y'] });
    });

    it('all() builds $all operator', () => {
      expect(new FilterOperator<string>().all(['tag1', 'tag2']).build()).toEqual({
        $all: ['tag1', 'tag2'],
      });
    });

    it('size() builds $size operator', () => {
      expect(new FilterOperator<string>().size(3).build()).toEqual({ $size: 3 });
    });
  });

  describe('field expression operators', () => {
    it('fieldEq() builds $eq array expression', () => {
      expect(new FilterOperator<string>().fieldEq('$role', 'admin').build()).toEqual({
        $eq: ['$role', 'admin'],
      });
    });

    it('fieldNe() builds $ne array expression', () => {
      expect(new FilterOperator<string>().fieldNe('$status', 'archived').build()).toEqual({
        $ne: ['$status', 'archived'],
      });
    });
  });

  describe('string operators', () => {
    it('regex() builds $regex operator', () => {
      expect(new FilterOperator<string>().regex('^laptop').build()).toEqual({
        $regex: '^laptop',
      });
    });
  });

  describe('element operators', () => {
    it('exists(true) builds $exists: true', () => {
      expect(new FilterOperator<unknown>().exists(true).build()).toEqual({ $exists: true });
    });

    it('exists(false) builds $exists: false', () => {
      expect(new FilterOperator<unknown>().exists(false).build()).toEqual({ $exists: false });
    });
  });

  describe('conditional operator', () => {
    it('cond() builds $cond expression', () => {
      const condition = new FilterOperator<string>().fieldEq('$role', 'admin').build();
      const result = new FilterOperator<boolean>()
        .cond(condition, { $literal: true }, false)
        .build();

      expect(result).toEqual({
        $cond: {
          if: { $eq: ['$role', 'admin'] },
          then: { $literal: true },
          else: false,
        },
      });
    });
  });

  describe('filter() factory function', () => {
    it('returns a new FilterOperator instance', () => {
      expect(filter<number>()).toBeInstanceOf(FilterOperator);
    });

    it('works the same as new FilterOperator()', () => {
      expect(filter<number>().gt(50).build()).toEqual(new FilterOperator<number>().gt(50).build());
    });
  });

  describe('method chaining', () => {
    it('multiple operators are applied to the same instance', () => {
      const result = new FilterOperator<number>().gte(100).lte(999).build();
      expect(result).toEqual({ $gte: 100, $lte: 999 });
    });
  });
});
