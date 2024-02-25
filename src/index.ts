import { CreateDtsOptions, createDts } from './core/createDts';
import { writeFile } from './core/writeFile';

type Options = Partial<{
  fileName: string;
  output: (dts: string) => unknown;
  createDts: CreateDtsOptions;
}>;

type Params = {
  name: string;
  parser: () => Promise<object> | object;
  directory: string;
  options?: Options;
};

export const generateDts = async ({
  name,
  directory,
  parser,
  options = {},
}: Params) => {
  const fileName = options.fileName || name;

  const parsed = await parser();
  const dts = createDts(fileName, parsed, options.createDts);

  if (options.output) {
    options.output(dts);
    return;
  }

  await writeFile(`${directory}/${fileName}.d.ts`, dts);
};
