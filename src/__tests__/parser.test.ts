import { describe, it, expect } from 'vitest';

import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';

import { publicGoogleSheetsParser, googleSpreadsheet } from '../parser';

const expected = {
  click_conversation_data: {
    conversation_id: 'string',
    created_at: 'Date',
    agent_type: 'string',
    status: 'StatusEnum',
    generate_position: "conversation' | 'playground'",
  },
  click_message_feedback_button: {
    conversation_id: 'string',
    message_id: 'string',
    generate_position: '"conversation" | "playground"',
    my_test: "string | 'string'",
  },
};

// https://docs.google.com/spreadsheets/d/1j23zhzHcPd_LzDQ7uPrXgMJfPoZYs289boUKoKnAjUo/edit#gid=0
const SHEET_NAME = 'ParserTest';
const SPREADSHEET_ID = '1j23zhzHcPd_LzDQ7uPrXgMJfPoZYs289boUKoKnAjUo';

describe('publicGoogleSheetsParser', () => {
  const publicGoogleSheetsParserInstance = new PublicGoogleSheetsParser(
    SPREADSHEET_ID,
    {
      sheetName: SHEET_NAME,
    },
  );

  it('Common forms', async () => {
    const parsed = await publicGoogleSheetsParser(
      publicGoogleSheetsParserInstance,
      {
        path: ['Key', 'Property'],
        typeName: 'Type',
      },
    )();

    expect(parsed).toEqual(expected);
  });

  it('With empty lines', async () => {
    const parsed = await publicGoogleSheetsParser(
      publicGoogleSheetsParserInstance,
      {
        path: ['Key', 'Property'],
        typeName: 'Type',
      },
    )();

    expect(parsed).toEqual(expected);
  });
});

const PRIVATE_SHEETS_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
];

/**
 * # How to test
 * (Do not upload the private-key.json file to a public repository!)
 *
 * 1. Create a private-key.json file.
 *   This can be created using https://medium.com/@sakkeerhussainp/google-sheet-as-your-database-for-node-js-backend-a79fc5a6edd9 as a guide.
 * 2. The contents of the sheet should be the same as https://docs.google.com/spreadsheets/d/1j23zhzHcPd_LzDQ7uPrXgMJfPoZYs289boUKoKnAjUo/edit#gid=0.
 *   If you want to use different data, edit the `expected` variable.
 * 3. Change the `describe.skip` method to the `describe`. (`describe.skip(...)` -> `describe(...)`)
 * 4. Run the test with the `pnpm test` command.
 */
describe.skip('GoogleSpreadsheet', () => {
  it('Common forms', async () => {
    // Do not upload the private-key.json file to a public repository when testing!
    // @ts-expect-error private-key
    const privateKey = await import('./private-key.json');

    const jwt = new JWT({
      email: privateKey.client_email,
      key: privateKey.private_key,
      scopes: PRIVATE_SHEETS_SCOPES,
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwt);
    await doc.loadInfo();

    const sheetInstance = doc.sheetsByIndex[0];

    const parsed = await googleSpreadsheet(sheetInstance, {
      path: ['Key', 'Property'],
      typeName: 'Type',
    })();

    expect(parsed).toEqual(expected);
  });
});
