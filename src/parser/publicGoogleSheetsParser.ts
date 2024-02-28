// Parser for public-google-sheets-parser
// https://github.com/fureweb-com/public-google-sheets-parser

import type PublicGoogleSheetsParser from 'public-google-sheets-parser';

type PublicGoogleSheetsParserParams = {
  path: string[];
  typeName: string;
};

export const publicGoogleSheetsParser =
  (
    publicGoogleSheetsParserInstance: PublicGoogleSheetsParser,
    { path, typeName }: PublicGoogleSheetsParserParams,
  ) =>
  async (): Promise<object> => {
    const data = await publicGoogleSheetsParserInstance.parse();

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
