const $ = "// Generated by google-spreadsheet-dts", f = [
  "/* eslint-disable */",
  "/* prettier-ignore */",
  "// @ts-nocheck",
  "// noinspection JSUnusedGlobalSymbols"
].join(`
`), m = (t, e, r = {}) => {
  const o = p(e, 4, d(r)), s = g(r.importTypes || []);
  return [
    $,
    f,
    s,
    "export {};",
    "declare global {",
    `  export interface ${t} ${o}`,
    "}"
  ].filter((n) => n).join(`
`);
}, d = (t) => ({
  defaultType: t.defaultType || "any"
}), g = (t) => {
  if (t.length)
    return t.map((e) => `import { ${e.name} } from '${e.from}';`).join(`
`);
}, p = (t, e, r) => {
  const o = " ".repeat(e), s = ["{"];
  for (const c in t) {
    const n = t[c], i = `${o}${c}: `, a = ";";
    if (!n) {
      s.push(`${i}${r.defaultType}${a}`);
      continue;
    }
    if (typeof n == "object") {
      s.push(
        `${i}${p(n, e + 2, r)}${a}`
      );
      continue;
    }
    if (y(n)) {
      s.push(`${i}${h(n)}${a}`);
      continue;
    }
    if (u(n)) {
      s.push(`${i}${l(n)}${a}`);
      continue;
    }
    s.push(`${i}${n}${a}`);
  }
  return s.push(`${" ".repeat(e - 2)}}`), s.join(`
`);
}, y = (t) => typeof t == "string" && t.includes("|"), h = (t) => t.split("|").map((e) => e.trim()).filter((e) => e !== "").map((e) => u(e) ? l(e) : e).join(" | "), u = (t) => typeof t == "string" && /^['"]?.*['"]$/.test(t), l = (t) => `'${t.replace(/['"]/g, "")}'`, b = async ({
  name: t,
  directory: e,
  parser: r,
  options: o = {}
}) => {
  const s = o.fileName || t, c = await r(), n = m(s, c, o.createDts);
  if (o.output) {
    o.output(n);
    return;
  }
  const { writeFile: i } = await import("./writeFile-BKeeM7nX.js");
  await i(`${e}/${s}.d.ts`, n);
};
export {
  b as generateDtsFile
};