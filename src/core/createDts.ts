const INFO = '// Generated by google-spreadsheet-dts';

const IGNORES = [
  '/* eslint-disable */',
  '/* prettier-ignore */',
  '// @ts-nocheck',
  '// noinspection JSUnusedGlobalSymbols',
].join('\n');

export type CreateDtsOptions = Partial<{
  defaultType: string;
  importTypes: Import[];
}>;

type Import = { name: string; from: string };

export const createDts = (
  name: string,
  object: object,
  options = {} as CreateDtsOptions,
): string => {
  const body = createItem(object, 4, defaultOptions(options));
  const imports = createImport(options.importTypes || []);

  const result = [
    INFO,
    IGNORES,
    imports,
    'export {};',
    'declare global {',
    `  export interface ${name} ${body}`,
    '}',
  ]
    .filter(v => v)
    .join('\n');

  return result;
};

const defaultOptions = (options: CreateDtsOptions) => ({
  defaultType: options.defaultType || 'any',
});

const createImport = (imports: Import[]) => {
  if (!imports.length) {
    return;
  }

  return imports.map(i => `import { ${i.name} } from '${i.from}';`).join('\n');
};

const createItem = <T>(
  object: T,
  space: number,
  options: CreateDtsOptions,
): string => {
  const spaceString = ' '.repeat(space);
  const result = ['{'];

  for (const name in object) {
    const value = object[name];
    const prefix = `${spaceString}${name}: `;
    const postfix = ';';

    if (!value) {
      result.push(`${prefix}${options.defaultType}${postfix}`);
      continue;
    }

    if (typeof value === 'object') {
      result.push(
        `${prefix}${createItem(value, space + 2, options)}${postfix}`,
      );
      continue;
    }

    if (isUnionValue(value)) {
      result.push(`${prefix}${getUnionValue(value)}${postfix}`);
      continue;
    }

    if (isStringValue(value)) {
      result.push(`${prefix}${getStringValue(value)}${postfix}`);
      continue;
    }

    result.push(`${prefix}${value}${postfix}`);
  }

  result.push(`${' '.repeat(space - 2)}}`);
  return result.join('\n');
};

const isUnionValue = (value: unknown): value is string =>
  typeof value === 'string' && value.includes('|');
const getUnionValue = (values: string) =>
  values
    .split('|')
    .map(value => value.trim())
    .filter(value => value !== '')
    .map(value => (isStringValue(value) ? getStringValue(value) : value))
    .join(' | ');

const isStringValue = (value: unknown): value is `'${string}'` =>
  typeof value === 'string' && /^['"]?.*['"]$/.test(value);
const getStringValue = (value: string) => `'${value.replace(/['"]/g, '')}'`;
