import React, { useMemo, useState } from "react";
import { WidgetCard } from "@aibyters/layout";
import { chartVars, type BaseChartProps } from "@aibyters/core";

export interface DataTableColumn<T = any> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  /** Numeric columns get tabular figures and right alignment by default. */
  type?: "text" | "number" | "date";
  format?: (value: any, row: T) => React.ReactNode;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: number | string;
  /** Hide this column below the given container breakpoint on small screens. */
  hideBelow?: number;
}

export interface DataTableProps<T = any> extends Pick<BaseChartProps, "title" | "description" | "className" | "style" | "variant" | "headerAction" | "footer" | "exportData" | "exportColumns" | "loading" | "emptyMessage"> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Enable client-side sorting by clicking headers. Default true. */
  sortable?: boolean;
  /** Rows per page; omit for no pagination. */
  pageSize?: number;
  /** Max body height (px) with a sticky header. */
  maxHeight?: number;
  /** Zebra striping. Default true. */
  striped?: boolean;
  /** Compact row density. */
  dense?: boolean;
  onRowClick?: (row: T, index: number) => void;
  rowKey?: (row: T, index: number) => string | number;
}

/**
 * Sortable, paginated data table with sticky header. Uses inline styles and CSS variables only,
 * so it renders identically in any host app.
 */
export function DataTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  sortable = true,
  pageSize,
  maxHeight,
  striped = true,
  dense = false,
  onRowClick,
  rowKey,
  exportData,
  exportColumns,
  emptyMessage = "No data available",
  loading,
  ...card
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    const copy = [...data];
    copy.sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      let cmp: number;
      if (col?.type === "number" || (typeof va === "number" && typeof vb === "number")) cmp = (Number(va) || 0) - (Number(vb) || 0);
      else if (col?.type === "date") cmp = new Date(va).getTime() - new Date(vb).getTime();
      else cmp = String(va ?? "").localeCompare(String(vb ?? ""), undefined, { numeric: true });
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [data, sort, columns]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const rows = pageSize ? sorted.slice(page * pageSize, (page + 1) * pageSize) : sorted;
  const padY = dense ? 6 : 10;
  const fontSize = 13;

  const cellStyle = (col: DataTableColumn<T>): React.CSSProperties => ({
    padding: `${padY}px 12px`,
    textAlign: col.align ?? (col.type === "number" ? "right" : "left"),
    fontVariantNumeric: col.type === "number" ? "tabular-nums" : undefined,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 320,
    width: col.width,
    borderBottom: `1px solid ${chartVars.grid}`,
    fontSize,
  });

  const toggleSort = (key: string) => {
    setPage(0);
    setSort((s) => (s?.key === key ? (s.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" }));
  };

  return (
    <WidgetCard title={title} description={description} exportData={exportData ?? data} exportColumns={exportColumns ?? columns.map((c) => c.key)} {...card}>
      <div style={{ width: "100%", overflowX: "auto", maxHeight, overflowY: maxHeight ? "auto" : undefined, WebkitOverflowScrolling: "touch" }} className="vi-data-table">
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, color: chartVars.textPrimary, fontFamily: chartVars.fontBody }} aria-busy={loading || undefined}>
          <thead>
            <tr>
              {columns.map((col) => {
                const canSort = sortable && col.sortable !== false;
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                    onClick={canSort ? () => toggleSort(col.key) : undefined}
                    style={{
                      ...cellStyle(col),
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      background: "var(--vi-color-surface-elevated, var(--vi-color-surface-card))",
                      color: chartVars.textSecondary,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      cursor: canSort ? "pointer" : "default",
                      userSelect: "none",
                      borderBottom: `1px solid ${chartVars.border}`,
                    }}
                  >
                    {col.header}
                    {canSort && <span aria-hidden style={{ marginLeft: 4, opacity: active ? 1 : 0.35 }}>{active ? (sort!.dir === "asc" ? "▲" : "▼") : "↕"}</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const idx = page * (pageSize ?? 0) + i;
              return (
                <tr
                  key={rowKey ? rowKey(row, idx) : idx}
                  onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick(row, idx); } } : undefined}
                  style={{ background: striped && i % 2 === 1 ? "var(--vi-color-surface-elevated, transparent)" : "transparent", cursor: onRowClick ? "pointer" : "default" }}
                  className="vi-data-table__row"
                >
                  {columns.map((col) => (
                    <td key={col.key} style={cellStyle(col)} title={typeof row[col.key] === "string" ? row[col.key] : undefined}>
                      {col.render ? col.render(row[col.key], row) : col.format ? col.format(row[col.key], row) : col.type === "number" && typeof row[col.key] === "number" ? row[col.key].toLocaleString() : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ padding: 32, textAlign: "center", color: chartVars.textSecondary, fontSize }}>
                  {loading ? "Loading…" : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pageSize && sorted.length > pageSize && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, fontSize: 12, color: chartVars.textSecondary, gap: 8, flexWrap: "wrap" }}>
          <span>
            {page * pageSize + 1}–{Math.min(sorted.length, (page + 1) * pageSize)} of {sorted.length.toLocaleString()}
          </span>
          <span style={{ display: "inline-flex", gap: 6 }}>
            <PagerButton disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</PagerButton>
            <PagerButton disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)}>Next</PagerButton>
          </span>
        </div>
      )}
    </WidgetCard>
  );
}

function PagerButton({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ minHeight: 32, padding: "4px 12px", borderRadius: 6, border: `1px solid ${chartVars.border}`, background: "transparent", color: disabled ? chartVars.textMuted : chartVars.textPrimary, font: "inherit", cursor: disabled ? "default" : "pointer" }}
    >
      {children}
    </button>
  );
}
