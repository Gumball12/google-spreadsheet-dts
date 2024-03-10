import { CreateDtsOptions, createDtsBody } from './createDtsBody';

type GenerateDtsFileOptions = Partial<{
  fileName: string;
  output: (dts: string) => unknown;
  createDtsBody: CreateDtsOptions;
}>;

type Parser = () => Promise<object> | object;

export type GenerateDtsFileParams = {
  name: string;
  parser: Parser;
  directory: string;
  options?: GenerateDtsFileOptions;
};

export const generateDtsFile = async ({
  name,
  directory,
  parser,
  options = {},
}: GenerateDtsFileParams) => {
  const fileName = options.fileName || name;

  const parsed = await parser();
  const dts = createDtsBody(fileName, parsed, options.createDtsBody);

  if (options.output) {
    options.output(dts);
    return;
  }

  const { writeFile } = await import('./writeFile');
  await writeFile(`${directory}/${fileName}.d.ts`, dts);
};
