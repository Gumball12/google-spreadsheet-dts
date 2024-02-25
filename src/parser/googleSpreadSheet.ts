import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export const googleSpreadsheetParser = async (
  spreadsheetId: string,
  serviceAccountAuth: JWT,
) => {
  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  await sheet.loadHeaderRow();

  const rows = await sheet.getRows();
  console.log(rows, sheet.headerValues);
};
