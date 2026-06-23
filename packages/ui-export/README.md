# @aibyters/ui-export

A tiny, **zero‑dependency** utility package that provides CSV and Excel (XLSX) export functions for any JavaScript/TypeScript project.

It was extracted from the `@aibyters/core` package so you can use the export feature **without pulling in the whole UI library**. The implementation is pure‑JavaScript and works both in the browser and in Node (for server‑side CSV generation).

---

## 📦 Installation

```bash
# From your project root (e.g. a Frappe app, Next.js, Vite, etc.)
npm install file:../aibyters/packages/ui-export   # local dev install
# or, after publishing to a registry
npm install @aibyters/ui-export
```

> **Note** – The `file:` reference works for a local monorepo. Adjust the relative path to where the `ui-export` package lives on your machine.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **CSV export** | `downloadCSV(data, filename, columns?)` – creates a UTF‑8 BOM CSV blob and triggers a download in the browser.
| **Excel export** | `downloadExcel(data, filename, columns?)` – builds a minimal XLSX file (no external libraries) and triggers a download.
| **Utility functions** | `dataToCSV(data, columns?)` – returns the CSV string (useful for server‑side generation).
| **No dependencies** | Pure TypeScript/JavaScript – only uses the browser `Blob` API.

---

## 🛠️ Usage (React example)

```tsx
import React from "react";
import { downloadCSV, downloadExcel } from "@aibyters/ui-export";

const sample = [
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 950 },
];

export const SalesWidget = () => (
  <div style={{ border: "1px solid #ddd", padding: 16 }}>
    <h3>Monthly Sales</h3>
    {/* Your chart component goes here */}
    <button onClick={() => downloadCSV(sample, "sales")}>CSV</button>
    <button onClick={() => downloadExcel(sample, "sales")}>Excel</button>
  </div>
);
```

The exported functions automatically create a downloadable file with the given `filename` (extension is added for you).

---

## 📚 API

```ts
/** Convert an array of objects to a CSV string. */
export function dataToCSV(
  data: Record<string, any>[],
  columns?: string[]
): string;

/** Trigger a CSV download in the browser. */
export function downloadCSV(
  data: Record<string, any>[],
  filename: string,
  columns?: string[]
): void;

/** Trigger an Excel (XLSX) download in the browser. */
export function downloadExcel(
  data: Record<string, any>[],
  filename: string,
  columns?: string[]
): void;
```

---

## 🚀 Building & Publishing

The package ships TypeScript source files and a pre‑compiled `dist` folder.

```bash
# Build the package (produces ./dist)
npm run build

# Run a quick type‑check
npm run typecheck

# Run unit tests (if you add any)
npm test
```

When you’re ready to publish to npm (or your private registry):

```bash
npm publish --access public   # or use your registry config
```

---

## 🤝 Contributing

Feel free to open a PR if you find a bug or want to add a feature (e.g., supporting custom delimiters for CSV). The code lives in `src/export-utils.ts` – it is deliberately simple and dependency‑free.

---

## 📄 License

MIT © aibyters team.
