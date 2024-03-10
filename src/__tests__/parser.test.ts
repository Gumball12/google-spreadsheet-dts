import { describe, it, expect } from 'vitest';

import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';

import {
  publicGoogleSheetsParser,
  googleSpreadsheet,
  filledDataToObject,
} from '../parser';

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

  it('Common forms :: Pass instance', async () => {
    const parsed = await publicGoogleSheetsParser(
      publicGoogleSheetsParserInstance,
      {
        path: ['Key', 'Property'],
        typeName: 'Type',
      },
    )();

    expect(parsed).toEqual(expected);
  });

  it('Common forms :: Pass options', async () => {
    const parsed = await publicGoogleSheetsParser(
      {
        spreadsheetId: SPREADSHEET_ID,
        sheetInfo: SHEET_NAME,
      },
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

const hasPrivate =
  import.meta.env.VITE_PRIVATE_GOOGLE_SHEETS_CLIENT_EMAIL &&
  import.meta.env.VITE_PRIVATE_GOOGLE_SHEETS_PRIVATE_KEY;

describe.skipIf(!hasPrivate)('GoogleSpreadsheet', () => {
  const privateEmail = import.meta.env.VITE_PRIVATE_GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = import.meta.env.VITE_PRIVATE_GOOGLE_SHEETS_PRIVATE_KEY;

  it('Common forms :: Pass sheet instance', async () => {
    const jwt = new JWT({
      email: privateEmail,
      key: privateKey,
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

describe('filledDataToObject', () => {
  it('Common forms', () => {
    const filledData = [
      {
        Key: 'click_conversation_data',
        Property: 'conversation_id',
        Type: 'string',
      },
      {
        Key: 'click_conversation_data',
        Property: 'created_at',
        Type: 'Date',
      },
      {
        Key: 'click_conversation_data',
        Property: 'agent_type',
        Type: 'string',
      },
      {
        Key: 'click_conversation_data',
        Property: 'status',
        Type: 'StatusEnum',
      },
      {
        Key: 'click_conversation_data',
        Property: 'generate_position',
        Type: "conversation' | 'playground'",
      },
      {
        Key: 'click_message_feedback_button',
        Property: 'conversation_id',
        Type: 'string',
      },
      {
        Key: 'click_message_feedback_button',
        Property: 'message_id',
        Type: 'string',
      },
      {
        Key: 'click_message_feedback_button',
        Property: 'generate_position',
        Type: '"conversation" | "playground"',
      },
      {
        Key: 'click_message_feedback_button',
        Property: 'my_test',
        Type: "string | 'string'",
      },
    ];

    const transformed = filledDataToObject(
      filledData,
      ['Key', 'Property'],
      'Type',
    );

    expect(transformed).toEqual(expected);
  });
});
