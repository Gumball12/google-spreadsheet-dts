import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import type PublicGoogleSheetsParser from 'public-google-sheets-parser';

declare type FilledData = Record<string, string>[];

export declare const filledDataToObject: (filledData: FilledData, path: string[], typeName: string) => Result;

export declare const googleSpreadsheet: (sheetInstance: GoogleSpreadsheetWorksheet, { path, typeName }: GoogleSpreadsheetParams) => () => Promise<object>;

declare type GoogleSpreadsheetParams = {
    path: string[];
    typeName: string;
};

export declare const publicGoogleSheetsParser: (publicGoogleSheetsParserInstance: PublicGoogleSheetsParser, { path, typeName }: PublicGoogleSheetsParserParams) => () => Promise<object>;

declare type PublicGoogleSheetsParserParams = {
    path: string[];
    typeName: string;
};

declare type Result = {
    [key: string]: string | Result;
};

export { }
