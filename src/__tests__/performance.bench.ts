import { describe, bench } from 'vitest';
import { createDtsBody } from '../core/createDtsBody';

describe('Benchmarking', () => {
  bench('createDtsBody :: 100000 Rows', async () => {
    const largeObject = [...Array(100000).keys()].reduce<object>((acc, cur) => {
      // @ts-expect-error - This is a test
      acc[`key${cur}`] = cur;
      return acc;
    }, {});

    await createDtsBody('largeObject', largeObject);
  });
});
