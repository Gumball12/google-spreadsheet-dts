import { generateDtsFile } from 'google-spreadsheet-dts';
import { filledDataToObject } from 'google-spreadsheet-dts/parser';

import { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import hljs from 'highlight.js';
import { HotTable } from '@handsontable/react';
import { useCopyToClipboard } from 'react-use';

import LogoSrc from '../../docs/logo.png';

const INITIAL_NAME = 'GoogleSpreadsheetDts';
const INITIAL_PATH_HEADER = ['Key', 'Property'];
const INITIAL_TYPE_HEADER = 'Type';

// https://docs.google.com/spreadsheets/d/1j23zhzHcPd_LzDQ7uPrXgMJfPoZYs289boUKoKnAjUo/edit?pli=1#gid=0
const INITIAL_DATA = [
  ['Page', 'Key', 'Property', 'Type'],
  ['conversation', 'click_conversation_data', 'conversation_id', 'string'],
  ['', '', 'created_at', 'Date'],
  ['', '', 'agent_type', 'string'],
  ['', '', 'status', 'StatusEnum'],
  ['', '', 'generate_position', `conversation' | 'playground'`],

  [
    'conversation',
    'click_message_feedback_button',
    'conversation_id',
    'string',
  ],
  ['', '', 'message_id', 'string'],
  ['', '', 'generated_position', '"conversation" | "playground"'],
  ['', '', 'my_test', `string | 'string'`],
];

const COPY_DEBOUNCE_MS = 1000;

export const App = () => {
  /* state */

  const [name, setName] = useState(INITIAL_NAME);
  const [pathHeader, setPathHeader] = useState<string[]>(INITIAL_PATH_HEADER);
  const [typeHeader, setTypeHeader] = useState(INITIAL_TYPE_HEADER);
  const [errorMessage, setErrorMessage] = useState('');

  /* generate dts */

  const [dts, setDts] = useState('');
  const [data, setData] = useState(INITIAL_DATA);

  const hotRef = useRef<HotTable>(null);
  const updateDts = useCallback(async () => {
    if (!hotRef.current) {
      return;
    }

    setErrorMessage('');

    // @ts-expect-error bypass strange type error
    const data = hotRef.current.hotInstance.getData() as string[][];
    setData(data);

    try {
      await generateDtsFile({
        name,
        directory: './',
        parser: () => {
          if (!pathHeader.length || !typeHeader.length) {
            throw new Error('Path header and type header are required');
          }

          if (data.length < 2) {
            throw new Error('Data is required');
          }

          if (name.length < 1) {
            throw new Error('Name is required');
          }

          const headerRow = data[0];
          const dataRows = data.slice(1);

          const filteredPathHeader = pathHeader.filter(({ length }) => length);

          if (filteredPathHeader.some(cell => headerRow.indexOf(cell) === -1)) {
            throw new Error('Path header is invalid');
          }

          if (headerRow.indexOf(typeHeader) === -1) {
            throw new Error('Type header is invalid');
          }

          const keys = [...filteredPathHeader, typeHeader];
          const keyIndexList = keys.map(key => headerRow.indexOf(key));

          const filledData = dataRows.reduce(
            (acc, row, rowIndex) => {
              const obj: Record<string, string> = {};
              keyIndexList.forEach((colIndex, i) => {
                const cell = row[colIndex];
                const keyName = keys[i];

                if (cell) {
                  obj[keyName] = cell;
                } else {
                  obj[keyName] = acc[rowIndex - 1][keyName];
                }
              });

              acc.push(obj);
              return acc;
            },
            [] as Record<string, string>[],
          );

          return filledDataToObject(filledData, filteredPathHeader, typeHeader);
        },
        options: {
          output: setDts,
        },
      });
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  }, [pathHeader, typeHeader, name]);

  /* highlight dts code */

  const codeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    updateDts();
    delete codeRef.current?.dataset.highlighted;
    hljs.highlightAll();
  }, [dts, updateDts]);

  /* copy & copy state */

  const [isCopied, setIsCopied] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const debouncedIsCopiedTrue = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setIsCopied(true);

    const nextTimeoutId = setTimeout(() => {
      setIsCopied(false);
      setTimeoutId(undefined);
    }, COPY_DEBOUNCE_MS);
    setTimeoutId(nextTimeoutId);
  }, [timeoutId]);

  const [, copyToClipboard] = useCopyToClipboard();
  const copyDtsToClipboard = () => {
    copyToClipboard(dts);
    debouncedIsCopiedTrue();
  };

  return (
    <div className="p-4 flex flex-col gap-4 bg-neutral-900 min-h-full text-white font-sans">
      {errorMessage && (
        <div
          className={classnames(
            'fixed right-4 bottom-4 left-12 p-2 bg-red-500 rounded-md z-9999',
            'sm:left-unset sm:max-w-sm',
          )}
        >
          {errorMessage}
        </div>
      )}

      <header className="flex flex-col gap-2">
        <div className="w-32">
          <img src={LogoSrc} alt="Logo" />
        </div>
        <h1 className="text-4xl font-bold pt-4">Google Spreadsheet DTS</h1>
        <p className="text-xl">
          Generate TypeScript type definition file (
          <code className="bg-neutral-800 px-1">*.d.ts</code>) from Google
          Spreadsheet
        </p>
        <p>
          <a
            href="https://github.com/Gumball12/google-spreadsheet-dts"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository
          </a>
        </p>
        <p>
          <a
            href="https://www.npmjs.com/package/google-spreadsheet-dts"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            NPM Package
          </a>
        </p>
      </header>

      <hr />

      <main className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">
            Online demo w/{' '}
            <a
              href="https://handsontable.com"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Handsontable
            </a>
          </h2>

          <p className="text-sm text-neutral-500">
            After modifying the sheet, you need to press the "Generate DTS"
            button to generate the code.
          </p>
        </div>

        <HotTable
          // @ts-expect-error bypass strange type error
          ref={hotRef}
          data={data}
          height="300px"
          contextMenu
          rowHeaders
          colHeaders
          autoWrapRow
          autoWrapCol
          minSpareRows={1}
          minSpareCols={1}
          licenseKey="non-commercial-and-evaluation"
        />

        <div className="flex flex-col gap-2 max-w-xs">
          <div className="flex flex-col gap-1">
            <label className="text-lg font-bold">Name</label>
            <p className="text-sm text-neutral-500">The name of the type.</p>
          </div>

          <input
            type="text"
            className="p-2 rounded-md bg-neutral-800"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 max-w-xs">
          <div className="flex flex-col gap-1">
            <label className="text-lg font-bold">Path Header</label>
            <p className="text-sm text-neutral-500">
              The name of the header for the property path.{' '}
              <strong>
                Different ordering will have different resulting values.
              </strong>
            </p>
          </div>

          {pathHeader.map((header, i) => (
            <div className="flex gap-2" key={i}>
              <input
                type="text"
                className="p-2 rounded-md bg-neutral-800 flex-1"
                value={header}
                onChange={e => {
                  const nextPathHeader = [...pathHeader];
                  nextPathHeader[i] = e.target.value;
                  setPathHeader(nextPathHeader);
                }}
              />
              <button
                className="btn w-8"
                onClick={() => {
                  const nextPathHeader = [...pathHeader];
                  nextPathHeader.splice(i, 1);
                  setPathHeader(nextPathHeader);
                }}
              >
                -
              </button>
            </div>
          ))}

          <button
            className="btn w-8 w-full"
            onClick={() => setPathHeader([...pathHeader, ''])}
          >
            +
          </button>
        </div>

        <div className="flex flex-col gap-2 max-w-xs">
          <div className="flex flex-col gap-1">
            <label className="text-lg font-bold">Type Header</label>
            <p className="text-sm text-neutral-500">
              The name of the header for the column on which the type is
              defined.
            </p>
          </div>

          <input
            type="text"
            className="p-2 rounded-md bg-neutral-800"
            value={typeHeader}
            onChange={e => setTypeHeader(e.target.value)}
          />
        </div>

        <button onClick={updateDts} className="btn">
          Generate DTS
        </button>

        <div
          className={classnames(
            'relative p-4 cursor-pointer rounded-md shadow-md bg-neutral-800',
            'hover:shadow-lg hover:md:-translate-y-1 transition',
          )}
        >
          <pre>
            <code ref={codeRef} className="language-typescript bg-transparent!">
              {dts}
            </code>
          </pre>

          <button
            className={classnames(
              'btn',
              'absolute right-4 top-4 p-2',
              'bg-neutral-700 hover:bg-neutral-700/80 active:bg-neutral-700/60',
            )}
            onClick={copyDtsToClipboard}
          >
            {isCopied ? (
              <i className="i-material-symbols:check-small-rounded" />
            ) : (
              <i className="i-material-symbols:content-copy-outline" />
            )}
          </button>
        </div>
      </main>
    </div>
  );
};
