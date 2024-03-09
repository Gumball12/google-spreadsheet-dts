import { describe, it, expect } from 'vitest';
import { createDts } from '../core/createDts';

const PREFIX = `// Generated by google-spreadsheet-dts
/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols`;

describe('createDts', () => {
  it('Common forms', () => {
    const name = 'createDts';
    const dts = createDts(name, {
      a: 'string',
      b: 1,
      c: true,
      d: { e: 'string' },
      f: '"string"',
      // prettier-ignore
      g: '\'string\'',
      // prettier-ignore
      h: 'string\'',
      i: "'a'|'b' |    'c'|",
      j: { k: "string | string'" },
      l: "1 | '1'",
      m: 1,
      n: '1',
      o: '"1"',
    });

    expect(dts).toBe(
      getDtsBody(name, [
        'a: string',
        'b: 1',
        'c: true',
        'd: {\n      e: string;\n    }',
        "f: 'string'",
        "g: 'string'",
        "h: 'string'",
        "i: 'a' | 'b' | 'c'",
        "j: {\n      k: string | 'string';\n    }",
        "l: 1 | '1'",
        'm: 1',
        'n: 1',
        "o: '1'",
      ]),
    );
  });

  it('With options', () => {
    const name = 'createDts';
    const dts = createDts(
      name,
      { a: 'string', b: undefined },
      { defaultType: 'unknown' },
    );

    expect(dts).toBe(getDtsBody(name, ['a: string', 'b: unknown']));
  });

  it('With imports', () => {
    const name = 'createDts';
    const dts = createDts(
      name,
      { a: 'A' },
      { importTypes: [{ name: 'A', from: './a' }] },
    );

    expect(dts).toBe(
      `${PREFIX}
import { A } from './a';
export {};
declare global {
  export interface ${name} {
    a: A;
  }
}`,
    );
  });
});

const getDtsBody = (name: string, fieldList: string[]) => {
  const body = fieldList.map(field => `    ${field};`).join('\n');
  return `${PREFIX}
export {};
declare global {
  export interface ${name} {
${body}
  }
}`;
};