> [!NOTE]
> See the [Writing a custom parser](#writing-a-custom-parser) section for how to write a custom parser.

# Parsers preset

## public-google-sheets-parser

A parser that parses **public** Google Sheets. This parser uses [public-google-sheets-parser](https://github.com/fureweb-com/public-google-sheets-parser).

### Usage

```ts
import { generateDtsFile } from 'google-spreadsheet-dts';
import { publicGoogleSheetsParser } from 'google-spreadsheet-dts/parser';

// Define parser
const parser = publicGoogleSheetsParser(
  // You can pass an instance of PublicGoogleSheetsParser
  {
    spreadsheetId: '1j23zhzHcPd_LzDQ7uPrXgMJfPoZYs289boUKoKnAjUo',
  },
  {
    path: ['Key', 'Property'],
    typeName: 'Type',
  },
);

// Generate d.ts file
generateDtsFile({
  name: 'GoogleSheets',
  directory: resolve(__dirname, '../src'),
  parser,
});
```

### API

#### `publicGoogleSheetsParser`

```ts
function publicGoogleSheetsParser(
  instanceOrOptions: PublicGoogleSheetsParser | PublicGoogleSheetsParserOptions,
  params: {
    path: string[];
    typeName: string;
  },
): Parser;

interface PublicGoogleSheetsParserOptions {
  spreadsheetId: string;
  sheetInfo:
    | SheetName
    | {
        sheetName?: SheetName;
        sheetId?: GID;
      };
}

type SheetName = string;
type GID = string;
```

- `instanceOrOptions`: An instance of [`PublicGoogleSheetsParser`](https://github.com/fureweb-com/public-google-sheets-parser?tab=readme-ov-file#usage-example) or an object with the following properties:
  - `spreadsheetId`: The ID of the Google Sheets
  - `sheetInfo`: The sheet name or an object with the following properties:
    - `sheetName`: The sheet name
    - `sheetId`: The sheet ID
- `path`: List of column names where object property names exists
- `typeName`: Column name where the type name exists

For example, given the following Google Sheets:

| Key  | Property  | Type    |
| ---- | --------- | ------- |
| key1 | property1 | "type1" |
| key2 | property2 | "type2" |
| key3 | property3 | MyType  |

If `path` is `['Key', 'Property']` and `typeName` is `Type`, the return will look like this:

```ts
({
  key1: {
    property1: "'type1'",
  },
  key2: {
    property2: "'type2'",
  },
  key3: {
    property3: 'MyType',
  },
});
```

## private-google-sheets-parser

A parser that parses **private** Google Sheets. This parser uses [google-spreadsheet](https://github.com/theoephraim/node-google-spreadsheet).

### Usage

```ts
import { generateDtsFile } from 'google-spreadsheet-dts';
import { privateGoogleSheetsParser } from 'google-spreadsheet-dts/parser';
import { JWT } from 'google-auth-library';

// Define parser
const parser = privateGoogleSheetsParser(
  // You can pass an instance of GoogleSpreadsheetWorksheet (https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-worksheet)
  {
    auth: new JWT(/* ... */),
    spreadsheetId: '...',
    sheetInfo: 0, // Index of the sheet
  },
  {
    path: ['Key', 'Property'],
    typeName: 'Type',
  },
);

// Generate d.ts file
generateDtsFile({
  name: 'GoogleSheets',
  directory: resolve(__dirname, '../src'),
  parser,
});
```

Note that you need to pass the [sheet instance](https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-worksheet).

### API

#### `privateGoogleSheetsParser`

```ts
function privateGoogleSheetsParser(
  instanceOrOptions:
    | GoogleSpreadsheetWorksheet
    | PrivateGoogleSheetsParserOptions,
  params: {
    path: string[];
    typeName: string;
  },
): Parser;

interface PrivateGoogleSheetsParserOptions {
  auth: JWT;
  spreadsheetId: string;
  sheetInfo: SheetName | SheetIndex;
}

type SheetName = string;
type SheetIndex = number;
```

- `instanceOrOptions`: An instance of [`GoogleSpreadsheetWorksheet`](https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-worksheet) or an object with the following properties:
  - `auth`: An instance of [`JWT`](https://www.npmjs.com/package/google-auth-library#json-web-tokens) from [`google-auth-library`](https://www.npmjs.com/package/google-auth-library)
  - `spreadsheetId`: The ID of the Google Sheets
  - `sheetInfo`: The sheet name or the index of the sheet
- `path`: List of column names where object property names exists
- `typeName`: Column name where the type name exists

See [publicGoogleSheetsParser API](#public-google-sheets-parser) for a detailed description of the `path` and `typeName` behavior.

## Writing a custom parser

The parser is a function that returns an object. The object structure can be arbitrarily defined and is passed to the [`createDtsBody`](../core/createDtsBody.ts) function.

The object property value becomes the type name. This can also be arbitrarily as well, but they will all be converted to string types.

If you want the generated type to point to an actual type, just pass the type name as a string.

```ts
({
  key: {
    property: 'MyType' | 'YourType',
  },
});
```

```ts
// generated.d.ts

declare global {
  export interface GoogleSheets {
    key: {
      property: MyType | YourType;
    };
  }
}
```

If you want the generated type to be a string type, pass a string wrapped in quotes (`''` or `""`).

```ts
({
  key: {
    property: "'MyType' | 'YourType'",
  },
});
```

```ts
// generated.d.ts

declare global {
  export interface GoogleSheets {
    key: {
      property: 'MyType' | 'YourType';
    };
  }
}
```

These can be mixed and matched.

```ts
({
  key: {
    property: 'MyType' | "'YourType'",
  },
});
```

```ts
// generated.d.ts

declare global {
  export interface GoogleSheets {
    key: {
      property: MyType | 'YourType';
    };
  }
}
```

### `parser/filledDataToObject` Utility function

This utility function takes `FilledData` type data and converts it to an `object` type. It can be useful when creating parsers.

```ts
import { filledDataToObject } from 'google-spreadsheet-dts/parser';

filledDataToObject(
  [
    { Key: 'key1', Property: 'property1', Type: 'type1' },
    { Key: 'key2', Property: 'property2', Type: 'type2', Other: 'other' },
    { Key: 'key3', Property: 'property3', Type: 'MyType' },
  ],
  ['Key', 'Property'],
  'Type',
);

// Returns
({
  key1: {
    property1: 'type1',
  },
  key2: {
    property2: 'type2',
  },
  key3: {
    property3: 'MyType',
  },
});
```

**Type definition:**

```ts
type FilledData = Record<string, string>[];
type Result = {
  [key: string]: string | Result;
};

function filledDataToObject(
  filledData: FilledData,
  path: string[],
  typeName: string,
): Result;
```
