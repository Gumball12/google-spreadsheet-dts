"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const f=(a,t,s)=>a.reduce((l,o)=>{let e=l;for(let r=0;r<t.length-1;r++){const g=t[r],c=o[g];e[c]||(e[c]={}),e=e[c]}const n=t[t.length-1],u=o[n];return e[u]=o[s],l},{}),b=(a,{path:t,typeName:s})=>async()=>{const o=(await a.parse()).map((e,n,u)=>{if(n===0)return e;for(const r of t)e[r]||(e[r]=u[n-1][r]);return e});return f(o,t,s)},S=(a,{path:t,typeName:s})=>async()=>{const o=(await a.getRows()).reduce((e,n,u)=>{const r=e[u-1],g=[...t,s].reduce((c,d)=>{const i=n.get(d)||r[d];return c[d]=i,c},{});return e.push(g),e},[]);return f(o,t,s)};exports.filledDataToObject=f;exports.googleSpreadsheet=S;exports.publicGoogleSheetsParser=b;