/**
 * Export utilities for chart data — CSV and Excel (XLSX) formats.
 * 
 * CSV is generated natively with no dependencies.
 * Excel uses a minimal XLSX generator (no external dependencies).
 */

// ────────────────────────────────────────────
// CSV Export
// ────────────────────────────────────────────

function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Wrap in quotes if contains comma, quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function dataToCSV(data: Record<string, any>[], columns?: string[]): string {
  if (!data || data.length === 0) return "";

  const keys = columns || Object.keys(data[0]);
  const header = keys.map(escapeCSVValue).join(",");
  const rows = data.map(row =>
    keys.map(key => escapeCSVValue(row[key])).join(",")
  );

  return [header, ...rows].join("\n");
}

export function downloadCSV(data: Record<string, any>[], filename: string, columns?: string[]): void {
  const csv = dataToCSV(data, columns);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${sanitizeFilename(filename)}.csv`);
}

// ────────────────────────────────────────────
// Excel (XLSX) Export — minimal native implementation
// Uses the Office Open XML format without external dependencies
// ────────────────────────────────────────────

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateXLSX(data: Record<string, any>[], columns?: string[]): Blob {
  if (!data || data.length === 0) {
    return new Blob([], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  const keys = columns || Object.keys(data[0]);

  // Build the sheet XML rows
  let sheetRows = "";

  // Header row
  sheetRows += "<row>";
  keys.forEach((key, colIdx) => {
    const colRef = colLetter(colIdx) + "1";
    sheetRows += `<c r="${colRef}" t="inlineStr"><is><t>${xmlEscape(key)}</t></is></c>`;
  });
  sheetRows += "</row>";

  // Data rows
  data.forEach((row, rowIdx) => {
    const rowNum = rowIdx + 2;
    sheetRows += "<row>";
    keys.forEach((key, colIdx) => {
      const colRef = colLetter(colIdx) + rowNum;
      const val = row[key];
      if (val === null || val === undefined) {
        sheetRows += `<c r="${colRef}"/>`;
      } else if (typeof val === "number") {
        sheetRows += `<c r="${colRef}"><v>${val}</v></c>`;
      } else if (typeof val === "boolean") {
        sheetRows += `<c r="${colRef}" t="b"><v>${val ? 1 : 0}</v></c>`;
      } else {
        sheetRows += `<c r="${colRef}" t="inlineStr"><is><t>${xmlEscape(String(val))}</t></is></c>`;
      }
    });
    sheetRows += "</row>";
  });

  const lastCol = colLetter(keys.length - 1);
  const lastRow = data.length + 1;
  const dimension = `A1:${lastCol}${lastRow}`;

  // Minimal XLSX structure using XML
  const sheet1 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<dimension ref="${dimension}"/>
<sheetData>${sheetRows}</sheetData>
</worksheet>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  // Build ZIP using the minimal ZIP format
  return createMinimalZip({
    "[Content_Types].xml": contentTypes,
    "_rels/.rels": rels,
    "xl/workbook.xml": workbook,
    "xl/_rels/workbook.xml.rels": workbookRels,
    "xl/worksheets/sheet1.xml": sheet1,
  });
}

export function downloadExcel(data: Record<string, any>[], filename: string, columns?: string[]): void {
  const blob = generateXLSX(data, columns);
  triggerDownload(blob, `${sanitizeFilename(filename)}.xlsx`);
}

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

function colLetter(index: number): string {
  let result = "";
  let n = index;
  while (n >= 0) {
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ────────────────────────────────────────────
// Minimal ZIP builder (no dependencies)
// Produces a valid ZIP file from a map of filename → content
// ────────────────────────────────────────────

function createMinimalZip(files: Record<string, string>): Blob {
  const encoder = new TextEncoder();
  const entries: { name: Uint8Array; data: Uint8Array; offset: number }[] = [];
  const parts: Uint8Array[] = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const dataBytes = encoder.encode(content);
    const crc = crc32(dataBytes);

    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lhView = new DataView(localHeader.buffer);
    lhView.setUint32(0, 0x04034b50, true);   // local file header signature
    lhView.setUint16(4, 20, true);            // version needed
    lhView.setUint16(6, 0, true);             // flags
    lhView.setUint16(8, 0, true);             // compression: stored
    lhView.setUint16(10, 0, true);            // mod time
    lhView.setUint16(12, 0, true);            // mod date
    lhView.setUint32(14, crc, true);          // crc-32
    lhView.setUint32(18, dataBytes.length, true); // compressed size
    lhView.setUint32(22, dataBytes.length, true); // uncompressed size
    lhView.setUint16(26, nameBytes.length, true); // filename length
    lhView.setUint16(28, 0, true);            // extra field length
    localHeader.set(nameBytes, 30);

    entries.push({ name: nameBytes, data: dataBytes, offset });
    parts.push(localHeader, dataBytes);
    offset += localHeader.length + dataBytes.length;
  }

  // Central directory
  const centralStart = offset;
  for (const entry of entries) {
    const crc = crc32(entry.data);
    const cdHeader = new Uint8Array(46 + entry.name.length);
    const cdView = new DataView(cdHeader.buffer);
    cdView.setUint32(0, 0x02014b50, true);   // central directory signature
    cdView.setUint16(4, 20, true);            // version made by
    cdView.setUint16(6, 20, true);            // version needed
    cdView.setUint16(8, 0, true);             // flags
    cdView.setUint16(10, 0, true);            // compression
    cdView.setUint16(12, 0, true);            // mod time
    cdView.setUint16(14, 0, true);            // mod date
    cdView.setUint32(16, crc, true);          // crc-32
    cdView.setUint32(20, entry.data.length, true); // compressed size
    cdView.setUint32(24, entry.data.length, true); // uncompressed size
    cdView.setUint16(28, entry.name.length, true); // filename length
    cdView.setUint16(30, 0, true);            // extra field length
    cdView.setUint16(32, 0, true);            // comment length
    cdView.setUint16(34, 0, true);            // disk number
    cdView.setUint16(36, 0, true);            // internal attrs
    cdView.setUint32(38, 0, true);            // external attrs
    cdView.setUint32(42, entry.offset, true); // offset of local header
    cdHeader.set(entry.name, 46);

    parts.push(cdHeader);
    offset += cdHeader.length;
  }

  const centralSize = offset - centralStart;

  // End of central directory
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);   // end of central directory signature
  eocdView.setUint16(4, 0, true);             // disk number
  eocdView.setUint16(6, 0, true);             // disk with central dir
  eocdView.setUint16(8, entries.length, true); // entries on this disk
  eocdView.setUint16(10, entries.length, true);// total entries
  eocdView.setUint32(12, centralSize, true);   // central directory size
  eocdView.setUint32(16, centralStart, true);  // central directory offset
  eocdView.setUint16(20, 0, true);             // comment length
  parts.push(eocd);

  return new Blob(parts as BlobPart[], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

// CRC-32 lookup table
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
