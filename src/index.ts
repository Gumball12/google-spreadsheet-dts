import { CreateDtsOptions, createDts } from './core/createDts';
import { writeFile } from './core/writeFile';

type GenerateDtsOptions = Partial<{
  fileName: string;
  output: (dts: string) => unknown;
  createDts: CreateDtsOptions;
}>;

type GenerateDtsParams = {
  name: string;
  parser: () => Promise<object> | object;
  directory: string;
  options?: GenerateDtsOptions;
};

export const generateDts = async ({
  name,
  directory,
  parser,
  options = {},
}: GenerateDtsParams) => {
  const fileName = options.fileName || name;

  const parsed = await parser();
  const dts = createDts(fileName, parsed, options.createDts);

  if (options.output) {
    options.output(dts);
    return;
  }

  await writeFile(`${directory}/${fileName}.d.ts`, dts);
};
