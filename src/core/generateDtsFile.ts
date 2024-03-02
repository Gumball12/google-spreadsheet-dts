import { CreateDtsOptions, createDts } from './createDts';
import { writeFile } from './writeFile';

type GenerateDtsFileOptions = Partial<{
  fileName: string;
  output: (dts: string) => unknown;
  createDts: CreateDtsOptions;
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
  const dts = createDts(fileName, parsed, options.createDts);

  if (options.output) {
    options.output(dts);
    return;
  }

  await writeFile(`${directory}/${fileName}.d.ts`, dts);
};
