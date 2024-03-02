import { type GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { filledDataToObject } from './utils/filledDataToObject';
import { FilledData } from './types/data';

type GoogleSpreadsheetParams = {
  path: string[];
  typeName: string;
};

export const googleSpreadsheet =
  (
    sheetInstance: GoogleSpreadsheetWorksheet,
    { path, typeName }: GoogleSpreadsheetParams,
  ) =>
  async (): Promise<object> => {
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
