import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@aibyters/theme";
import { makeFormatter } from "@aibyters/spec";
import { LineChart, ColumnChart, BarChart, PieChart, DonutChart, RadialBarChart, ComboChart, WaterfallChart, RankedBarChart, DivergingBarChart, CompositionBandChart, StatusStripChart, DataTable } from "@aibyters/charts-bi";
import { DeltaCard, MetricCard, MetricStrip, TargetCard, SparklineCard } from "@aibyters/charts-kpi";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const regions = ["North America", "Europe, Middle East & Africa", "Asia Pacific", "Latin America", "Japan", "Corporate & Other"];
const rows = months.map((month, i) => ({
  month,
  "North America": 1_200_000 + i * 90_000,
  "Europe, Middle East & Africa": 800_000 + i * 50_000,
  "Asia Pacific": 600_000 + i * 70_000,
  "Latin America": 300_000 + i * 20_000,
  Japan: 250_000 + i * 10_000,
  "Corporate & Other": 100_000 + i * 5_000,
}));
const allocation = [
  { n: "Equities", v: 4200 }, { n: "Fixed Income", v: 3100 }, { n: "Alternatives", v: 900 }, { n: "Cash", v: 350 },
  { n: "Private Markets", v: 210 }, { n: "Structured Products", v: 120 }, { n: "Commodities", v: 80 }, { n: "FX Overlay", v: 40 },
];
const usd = makeFormatter("currency", { currency: "USD", compactFrom: 1000 });

function App() {
  return (
    <ThemeProvider theme="light" unstyled>
      <div className="grid">
        <MetricStrip title="Reconciliation summary" items={[
          { label: "Holdings linked", value: 8999, format: "count" },
          { label: "Values agree", value: 8404, format: "count", tone: "positive" },
          { label: "Need review", value: 595, format: "count", tone: "warning" },
          { label: "Gap", value: 12_450_000, format: "currency", delta: -0.08, tone: "negative" },
        ]} style={{ gridColumn: "1 / -1" }} />
        <LineChart title="AUM by region" description="Six regions, twelve months, currency ticks" data={rows} index="month" categories={regions} valueFormatter={usd} />
        <ColumnChart title="Stacked revenue" data={rows} index="month" categories={regions} stacked valueFormatter={usd} />
        <BarChart title="Revenue by region" data={rows.slice(0, 6)} index="month" categories={regions.slice(0, 3)} valueFormatter={usd} />
        <PieChart title="Asset allocation" data={allocation} dataKey="v" nameKey="n" />
        <DonutChart title="Allocation donut" data={allocation} dataKey="v" nameKey="n" centerValue="8,999" centerLabel="positions" />
        <RadialBarChart title="Radial" data={allocation.slice(0, 6)} dataKey="v" nameKey="n" />
        <ComboChart title="Volume vs rate" data={rows} index="month" barCategories={regions.slice(0, 2)} lineCategories={regions.slice(2, 3)} valueFormatter={usd} />
        <WaterfallChart title="ARR bridge" data={[{ name: "Start", value: 100 }, { name: "New", value: 25 }, { name: "Churn", value: -10 }, { name: "Total", value: 115 }]} />
        <RankedBarChart title="Which assets account for the gap?" data={[{ name: "Global Equities Fund", value: 1_842_300, meta: "18 accounts" }, { name: "Fixed Income Core", value: 1_210_450 }, { name: "EM Debt", value: 918_200 }, { name: "Private Credit", value: 655_900 }]} valueFormatter={usd} highlightTop={2} />
        <DivergingBarChart title="Which source marks higher?" data={[{ name: "US Large Cap", value: 412_500 }, { name: "European Equities", value: -188_200 }, { name: "IG Credit", value: 96_400 }, { name: "High Yield", value: -245_900 }]} valueFormatter={usd} />
        <CompositionBandChart title="Position mix" data={allocation.slice(0, 5).map((d) => ({ name: d.n, value: d.v }))} />
        <StatusStripChart title="Month-end status" data={months.map((m, i) => ({ label: m, status: i % 5 === 0 ? "breach" : i % 3 === 0 ? "review" : "reconciled", count: 4 + i }))} />
        <DeltaCard title="Net new money" value={1_250_000} delta={0.124} format="currency" deltaLabel="vs last month" />
        <MetricCard title="Positions" value={8999} format="count" />
        <TargetCard title="Coverage" value={91.2} target={95} format="number" />
        <SparklineCard title="Unmatched rate" value={0.031} format="percent" data={[0.05, 0.048, 0.044, 0.041, 0.037, 0.034, 0.031]} invertColors />
        <DataTable title="Top differences" data={allocation.map((d, i) => ({ asset: d.n, positions: d.v, diff: (i + 1) * 12_345 }))} columns={[{ key: "asset", header: "Asset" }, { key: "positions", header: "Positions", type: "number" }, { key: "diff", header: "Difference", type: "number", format: (v) => usd(Number(v)) }]} pageSize={5} style={{ gridColumn: "1 / -1" }} />
      </div>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
