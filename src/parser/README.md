> [!NOTE]
> See the [Writing a custom parser](#writing-a-custom-parser) section for how to write a custom parser.

# Parsers preset

## public-google-sheets-parser

A parser that parses public Google Sheets. This parser uses [public-google-sheets-parser](https://github.com/fureweb-com/public-google-sheets-parser).

### Usage

```ts
import { generateDts } from 'google-spreadsheet-dts';
import { publicGoogleSheetsParser } from 'google-spreadsheet-dts/parser';

const parser = publicGoogleSheetsParser({
  spreadSheetId: '1j23zhzHcPd_LzDQ7uPrXgMJfPoZYs289boUKoKnAjUo',
  path: ['Key', 'Property'],
  typeName: 'Type',
  publicGoogleSheetsParser: {
    sheetName: 'ParserTest',
  },
});

generateDts({
  name: 'GoogleSheets',
  directory: resolve(__dirname, '../src'),
  parser,
});
```

### API

#### `publicGoogleSheetsParser`

```ts
function publicGoogleSheetsParser(options: {
  spreadSheetId: string;
  path: string[];
  typeName: string;
  publicGoogleSheetsParser: PublicGoogleSheetsParserOptions;
}): Parser;

type PublicGoogleSheetsParserOptions = {
  sheetName: string;
};
```

- `spreadSheetId`: Google Sheets ID
- `path`: List of column names where object property names exists
- `typeName`: Column name where the type name exists
- `publicGoogleSheets`
  - `sheetName`: Google Sheets sheet name

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

## google-spreadsheet-parser

WIP

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
