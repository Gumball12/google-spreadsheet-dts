import { describe, it, expect } from 'vitest';
import { publicGoogleSheetsParser } from '../parser';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';

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
