import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { filledDataToObject } from './utils/filledDataToObject';
import { FilledData } from './types/data';

type GoogleSpreadsheetParams = {
  path: string[];
  typeName: string;
};

type SheetName = string;
type SheetIndex = number;

type GoogleSpreadsheetOptions = {
  auth: ConstructorParameters<typeof GoogleSpreadsheet>[1];
  spreadsheetId: ConstructorParameters<typeof GoogleSpreadsheet>[0];
  sheetInfo: SheetName | SheetIndex;
};

export const googleSpreadsheet =
  (
    instanceOfOptions: GoogleSpreadsheetWorksheet | GoogleSpreadsheetOptions,
    { path, typeName }: GoogleSpreadsheetParams,
  ) =>
  async (): Promise<object> => {
    const sheetInstance = await getSheetInstance(instanceOfOptions);
    const rows = await sheetInstance.getRows();
    const filledData = rows.reduce<FilledData>((filledData, row, index) => {
      const prevData = filledData[index - 1];
      const data = [...path, typeName].reduce<FilledData[number]>((acc, p) => {
        const item = row.get(p) || prevData[p];
        acc[p] = item;
        return acc;
      }, {});

      filledData.push(data);
      return filledData;
    }, []);

    return filledDataToObject(filledData, path, typeName);
  };

const getSheetInstance = async (
  instanceOfOptions: GoogleSpreadsheetWorksheet | GoogleSpreadsheetOptions,
) => {
  if (instanceOfOptions instanceof GoogleSpreadsheetWorksheet) {
    return instanceOfOptions;
  }

  const { auth, spreadsheetId, sheetInfo } = instanceOfOptions;
  const doc = new GoogleSpreadsheet(spreadsheetId, auth);
  await doc.loadInfo();

  if (typeof sheetInfo === 'number') {
    return doc.sheetsByIndex[sheetInfo];
  }

  return doc.sheetsByTitle[sheetInfo];
};
