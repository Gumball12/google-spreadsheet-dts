// Parser for public-google-sheets-parser
// https://github.com/fureweb-com/public-google-sheets-parser

import type PublicGoogleSheetsParser from 'public-google-sheets-parser';
import { FilledData } from './types/data';
import { filledDataToObject } from './utils/filledDataToObject';

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
    const parsedData = await publicGoogleSheetsParserInstance.parse();
    const filledData = parsedData.map<FilledData[number]>(
      (item, index, data) => {
        if (index === 0) {
          return item;
        }

        for (const p of path) {
          if (!item[p]) {
            item[p] = data[index - 1][p];
          }
        }

        return item;
      },
    );

    return filledDataToObject(filledData, path, typeName);
  };
