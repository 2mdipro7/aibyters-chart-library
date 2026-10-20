import React from 'react';
import { Grid, GridItem } from '@aibyters/layout';

export interface DashboardLayoutProps {
  title: string;
  audience: string;
  description: string;
  visuals: string[];
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  children: React.ReactNode;
}

/** Shared frame for the use-case dashboards: header, audience chip, list of visuals used, responsive grid. */
export function DashboardLayout({ title, audience, description, visuals, columns = 4, children }: DashboardLayoutProps) {
  return (
    <div className="chart-page">
      <div className="chart-page-header" style={{ marginBottom: 20 }}>
        <span className="chart-page-badge" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>Dashboard · {audience}</span>
        <h1 className="chart-page-title">{title}</h1>
        <p className="chart-page-description">{description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {visuals.map((v) => (
            <span key={v} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, border: '1px solid var(--vi-color-surface-border)', color: 'var(--vi-color-text-secondary)' }}>{v}</span>
          ))}
        </div>
      </div>
      <Grid columns={columns} minColumnWidth={240} gap="md">
        {children}
      </Grid>
    </div>
  );
}

export const Cell = ({ span = 1, children }: { span?: number; children: React.ReactNode }) => <GridItem colSpan={span}>{children}</GridItem>;

/** Deterministic pseudo-random for stable demo data. */
export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const usd = (v: number) => { const a = Math.abs(v); const s = v < 0 ? '−' : ''; return a >= 1e6 ? `${s}$${(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `${s}$${(a / 1e3).toFixed(0)}K` : `${s}$${a.toFixed(0)}`; };
export const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
export const pct0 = (v: number) => `${Math.round(v)}%`;
