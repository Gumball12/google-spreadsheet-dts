// Parser for public-google-sheets-parser
// https://github.com/fureweb-com/public-google-sheets-parser

import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import { CreateDtsOptions } from '../core/createDts';

type SheetName = string;
type PublicGoogleSheetsParserOptions = { sheetName: SheetName };

type Options = Partial<{
  publicGoogleSheetsParser: PublicGoogleSheetsParserOptions;
  createDts: CreateDtsOptions;
}>;

type Params = {
  spreadsheetId: string;
  path: string[];
  typeName: string;
  options?: Options;
};

export const publicGoogleSheetsParser =
  ({ spreadsheetId, path, typeName, options }: Params) =>
  async (): Promise<object> => {
    const parser = new PublicGoogleSheetsParser(
      spreadsheetId,
      options?.publicGoogleSheetsParser,
    );
    const data = await parser.parse();

    const filledData = data.map((item, index, data) => {
      if (index === 0) {
        return item;
      }

      for (const p of path) {
        if (!item[p]) {
          item[p] = data[index - 1][p];
        }
      }

      return item;
    });

    const result = filledData.reduce((acc, item) => {
      let current = acc;

      for (let i = 0; i < path.length - 1; i++) {
        const p = path[i];
        const name = item[p];

        if (!current[name]) {
          current[name] = {};
        }

        current = current[name];
      }

      const last = path[path.length - 1];
      const name = item[last];
      current[name] = item[typeName];

      return acc;
    }, {} as unknown);

    return result;
  };
