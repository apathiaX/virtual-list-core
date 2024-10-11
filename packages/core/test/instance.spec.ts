import { beforeEach, describe, expect, test } from 'vitest';
import { BaseVirtualList } from '../src';

describe('init', () => {
  describe('with out clientEl', () => {
    let ins: BaseVirtualList<any> | null = null;
    beforeEach(() => {
      const clientEl = document.createElement('div');
      const bodyEl = document.createElement('div');
      ins = new BaseVirtualList<any>({
        clientEl,
        bodyEl,
        list: [],
        itemKey: 'id',
      });
    });
    test('with out clientEl', () => {
      expect(ins).toBeInstanceOf(BaseVirtualList);
    });
  });
});
