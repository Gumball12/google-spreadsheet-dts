import { App } from './App.tsx';

import React from 'react';
import ReactDOM from 'react-dom/client';

import './main.css';
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';

import hljs from 'highlight.js';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/atom-one-dark.min.css';

import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();
hljs.registerLanguage('typescript', typescript);
hljs.configure({
  ignoreUnescapedHTML: true,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
