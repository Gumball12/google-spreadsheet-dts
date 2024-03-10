import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import { FilledData } from './types/data';
import { filledDataToObject } from './utils/filledDataToObject';

type PublicGoogleSheetsParserParams = {
  path: string[];
  typeName: string;
};

type PublicGoogleSheetsParserOptions = {
  spreadsheetId: ConstructorParameters<typeof PublicGoogleSheetsParser>[0];
  sheetInfo: ConstructorParameters<typeof PublicGoogleSheetsParser>[1];
};

export const publicGoogleSheetsParser =
  (
    instanceOrOptions:
      | PublicGoogleSheetsParser
      | PublicGoogleSheetsParserOptions,
    { path, typeName }: PublicGoogleSheetsParserParams,
  ) =>
  async (): Promise<object> => {
    const instance = getPublicGoogleSheetsParserInstance(instanceOrOptions);
    const parsedData = await instance.parse();
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

const getPublicGoogleSheetsParserInstance = (
  instanceOrOptions: PublicGoogleSheetsParser | PublicGoogleSheetsParserOptions,
) => {
  if (instanceOrOptions instanceof PublicGoogleSheetsParser) {
    return instanceOrOptions;
  }

  const { spreadsheetId, sheetInfo } = instanceOrOptions;
  return new PublicGoogleSheetsParser(spreadsheetId, sheetInfo);
};
