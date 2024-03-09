import { describe, bench } from 'vitest';
import { generateDtsFile } from '..';
import { resolve } from 'node:path';

const src = resolve(__dirname, '../');

describe('Benchmarking', () => {
  bench('createDtsBody :: 100000 Rows', async () => {
    const largeObject = [...Array(100000).keys()].reduce<object>((acc, cur) => {
      // @ts-expect-error - This is a test
      acc[`key${cur}`] = cur;
      return acc;
    }, {});

    await generateDtsFile({
      name: 'GenerateDtsFile',
      directory: resolve(src, './__tests__'),
      parser: () => largeObject,
      options: {
        output: () => {},
      },
    });
  });
});
