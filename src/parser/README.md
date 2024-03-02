> [!NOTE]
> See the [Writing a custom parser](#writing-a-custom-parser) section for how to write a custom parser.

# Parsers preset

## public-google-sheets-parser

A parser that parses **public** Google Sheets. This parser uses [public-google-sheets-parser](https://github.com/fureweb-com/public-google-sheets-parser).

### Usage

```ts
import { generateDtsFile } from 'google-spreadsheet-dts';
import { publicGoogleSheetsParser } from 'google-spreadsheet-dts/parser';

import PublicGoogleSheetsParser from 'public-google-sheets-parser';

// Define parser
const parser = publicGoogleSheetsParser(
  new PublicGoogleSheetsParser(/* ... */),
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
  publicGoogleSheetsParserInstance: PublicGoogleSheetsParser,
  params: {
    path: string[];
    typeName: string;
  },
): Parser;
```

- `publicGoogleSheetsParserInstance`: An instance of [`PublicGoogleSheetsParser`](https://github.com/fureweb-com/public-google-sheets-parser?tab=readme-ov-file#usage-example)
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
{
  key1: {
    property1: "'type1'";
  }
  key2: {
    property2: "'type2'";
  }
  key3: {
    property3: 'MyType';
  }
}
```

## google-spreadsheet (node-google-spreadsheet)

A parser that parses **private** Google Sheets. This parser uses [google-spreadsheet](https://github.com/theoephraim/node-google-spreadsheet).

### Usage

```ts
import { generateDtsFile } from 'google-spreadsheet-dts';
import { googleSpreadsheet } from 'google-spreadsheet-dts/parser';

import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

// Load private Google Sheets data
const jwt = new JWT(/* ... */);
const doc = new GoogleSpreadsheet(/* ... */);
await doc.loadInfo();

const sheet = doc.sheetsByIndex[0];

// Define parser
const parser = googleSpreadsheet(sheet, {
  path: ['Key', 'Property'],
  typeName: 'Type',
});

// Generate d.ts file
generateDtsFile({
  name: 'GoogleSheets',
  directory: resolve(__dirname, '../src'),
  parser,
});
```

Note that you need to pass the [sheet instance](https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-worksheet).

### API

#### `googleSpreadsheet`

```ts
function googleSpreadsheet(
  sheetInstance: GoogleSpreadsheetWorksheet,
  params: {
    path: string[];
    typeName: string;
  },
): Parser;
```

- `sheetInstance`: An instance of [`GoogleSpreadsheetWorksheet`](https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-worksheet)
- `path`: List of column names where object property names exists
- `typeName`: Column name where the type name exists

See [publicGoogleSheetsParser API](#public-google-sheets-parser) for a detailed description of the `path` and `typeName` behavior.

## Writing a custom parser

The parser is a function that returns an object. The object structure can be arbitrarily defined and is passed to the [`createDts`](../core/createDts.ts) function.

The object property value becomes the type name. This can also be arbitrarily as well, but they will all be converted to string types.

If you want the generated type to point to an actual type, just pass the type name as a string.

```ts
{
  key: {
    property: 'MyType' | 'YourType';
  }
}
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
{
  key: {
    property: "'MyType' | 'YourType'";
  }
}
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
{
  key: {
    property: 'MyType' | "'YourType'";
  }
}
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
  }
  key2: {
    property2: 'type2',
  }
  key3: {
    property3: 'MyType',
  }
})
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
