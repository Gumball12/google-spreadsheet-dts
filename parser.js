const f = (a, t, s) => a.reduce((l, n) => {
  let r = l;
  for (let e = 0; e < t.length - 1; e++) {
    const g = t[e], c = n[g];
    r[c] || (r[c] = {}), r = r[c];
  }
  const o = t[t.length - 1], u = n[o];
  return r[u] = n[s], l;
}, {}), p = (a, { path: t, typeName: s }) => async () => {
  const n = (await a.parse()).map(
    (r, o, u) => {
      if (o === 0)
        return r;
      for (const e of t)
        r[e] || (r[e] = u[o - 1][e]);
      return r;
    }
  );
  return f(n, t, s);
}, D = (a, { path: t, typeName: s }) => async () => {
  const n = (await a.getRows()).reduce((r, o, u) => {
    const e = r[u - 1], g = [...t, s].reduce((c, d) => {
      const w = o.get(d) || e[d];
      return c[d] = w, c;
    }, {});
    return r.push(g), r;
  }, []);
  return f(n, t, s);
};
export {
  f as filledDataToObject,
  D as googleSpreadsheet,
  p as publicGoogleSheetsParser
};
