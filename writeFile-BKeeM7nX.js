import { promises as e } from "node:fs";
const o = async (i, t) => {
  await e.writeFile(i, t, "utf-8");
};
export {
  o as writeFile
};
