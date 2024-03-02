import { FilledData } from '../types/data';

type Result = {
  [key: string]: string | Result;
};

export const filledDataToObject = (
  filledData: FilledData,
  path: string[],
  typeName: string,
): Result =>
  filledData.reduce<Result>((filledData, item) => {
    let current = filledData;
    for (let i = 0; i < path.length - 1; i++) {
      const p = path[i];
      const name = item[p];

      if (!current[name]) {
        current[name] = {};
      }

      // @ts-expect-error TS7053
      current = current[name];
    }

    const last = path[path.length - 1];
    const name = item[last];
    current[name] = item[typeName];

    return filledData;
  }, {});
