import { describe, it, expect } from 'vitest';
import { publicGoogleSheetsParser } from '../parser/publicGoogleSheetsParser';

const SPREADSHEET_ID = '1j23zhzHcPd_LzDQ7uPrXgMJfPoZYs289boUKoKnAjUo';

// https://docs.google.com/spreadsheets/d/1j23zhzHcPd_LzDQ7uPrXgMJfPoZYs289boUKoKnAjUo/edit#gid=0
const SHEET_NAME = 'ParserTest';

describe('publicGoogleSheetsParser', () => {
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
      SPREADSHEET_ID,
      ['Key', 'Property'],
      'Type',
      {
        publicGoogleSheetsParser: {
          sheetName: SHEET_NAME,
        },
      },
    );

    expect(parsed).toEqual(expected);
  });

  it('With empty lines', async () => {
    const parsed = await publicGoogleSheetsParser(
      SPREADSHEET_ID,
      ['Key', 'Property'],
      'Type',
      {
        publicGoogleSheetsParser: {
          sheetName: `${SHEET_NAME}-EmptyLines`,
        },
      },
    );

    expect(parsed).toEqual(expected);
  });
});
