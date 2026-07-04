import React, { useState, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import Overview from './pages/Overview';

// KPI Pages
import MetricCardPage from './pages/kpi/MetricCardPage';
import DeltaCardPage from './pages/kpi/DeltaCardPage';
import TargetCardPage from './pages/kpi/TargetCardPage';
import SparklineCardPage from './pages/kpi/SparklineCardPage';
import SeverityCardPage from './pages/kpi/SeverityCardPage';
import ProgressCardPage from './pages/kpi/ProgressCardPage';

// BI Pages
import LineChartPage from './pages/bi/LineChartPage';
import AreaChartPage from './pages/bi/AreaChartPage';
import BarChartPage from './pages/bi/BarChartPage';
import ColumnChartPage from './pages/bi/ColumnChartPage';
import ComboChartPage from './pages/bi/ComboChartPage';
import FunnelChartPage from './pages/bi/FunnelChartPage';
import DataTablePage from './pages/bi/DataTablePage';
import WaterfallChartPage from './pages/bi/WaterfallChartPage';
import MatrixTablePage from './pages/bi/MatrixTablePage';
import PieChartPage from './pages/bi/PieChartPage';
import DonutChartPage from './pages/bi/DonutChartPage';
import RadarChartPage from './pages/bi/RadarChartPage';
import ScatterChartPage from './pages/bi/ScatterChartPage';
import BubbleChartPage from './pages/bi/BubbleChartPage';
import TreemapChartPage from './pages/bi/TreemapChartPage';
import SankeyChartPage from './pages/bi/SankeyChartPage';
import RadialBarChartPage from './pages/bi/RadialBarChartPage';
import StackedAreaChartPage from './pages/bi/StackedAreaChartPage';
import GaugeChartPage from './pages/bi/GaugeChartPage';
import TimelineChartPage from './pages/bi/TimelineChartPage';
import BulletChartPage from './pages/bi/BulletChartPage';
import PolarAreaChartPage from './pages/bi/PolarAreaChartPage';
import CompetitivePositioningPage from './pages/bi/CompetitivePositioningPage';
import SWOTAnalysisPage from './pages/bi/SWOTAnalysisPage';
import RiskMatrixPage from './pages/bi/RiskMatrixPage';
import PestleAnalysisPage from './pages/bi/PestleAnalysisPage';

// DS Pages
import ForecastBandPage from './pages/ds/ForecastBandPage';
import AnomalyTimelinePage from './pages/ds/AnomalyTimelinePage';
import HistogramChartPage from './pages/ds/HistogramChartPage';
import BoxPlotChartPage from './pages/ds/BoxPlotChartPage';
import HeatmapChartPage from './pages/ds/HeatmapChartPage';
import ControlChartPage from './pages/ds/ControlChartPage';
import ViolinChartPage from './pages/ds/ViolinChartPage';
import CandlestickChartPage from './pages/ds/CandlestickChartPage';
import VolcanoPlotPage from './pages/ds/VolcanoPlotPage';

// Geo Pages
import ChoroplethMapPage from './pages/geo/ChoroplethMapPage';
import BubbleMapPage from './pages/geo/BubbleMapPage';
import ConnectionMapPage from './pages/geo/ConnectionMapPage';
import TileMapPage from './pages/geo/TileMapPage';

// Network Pages
import NetworkGraphPage from './pages/network/NetworkGraphPage';
import DependencyTreePage from './pages/network/DependencyTreePage';
import ChordDiagramPage from './pages/network/ChordDiagramPage';

// AI Pages
import InsightCardPage from './pages/ai/InsightCardPage';
import RecommendationCardPage from './pages/ai/RecommendationCardPage';

// Flow Pages
import FlowDiagramPage from './pages/flow/FlowDiagramPage';

// Infographics Pages
import InfographicsShowcasePage from './pages/infographics/InfographicsShowcasePage';

export default function App() {
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <HashRouter>
      <div className="app-layout">
        <Sidebar searchQuery={search} />

        <main className="app-main">
          <header className="app-topbar">
            <SearchBar value={search} onChange={setSearch} />
            <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
          </header>

          <div className="app-content">
            <Routes>
              <Route path="/" element={<Overview />} />

              {/* KPI */}
              <Route path="/kpi/metric" element={<MetricCardPage />} />
              <Route path="/kpi/delta" element={<DeltaCardPage />} />
              <Route path="/kpi/target" element={<TargetCardPage />} />
              <Route path="/kpi/sparkline" element={<SparklineCardPage />} />
              <Route path="/kpi/severity" element={<SeverityCardPage />} />
              <Route path="/kpi/progress" element={<ProgressCardPage />} />

              {/* BI */}
              <Route path="/bi/line" element={<LineChartPage />} />
              <Route path="/bi/area" element={<AreaChartPage />} />
              <Route path="/bi/bar" element={<BarChartPage />} />
              <Route path="/bi/column" element={<ColumnChartPage />} />
              <Route path="/bi/combo" element={<ComboChartPage />} />
              <Route path="/bi/funnel" element={<FunnelChartPage />} />
              <Route path="/bi/table" element={<DataTablePage />} />
              <Route path="/bi/waterfall" element={<WaterfallChartPage />} />
              <Route path="/bi/matrix" element={<MatrixTablePage />} />
              <Route path="/bi/pie" element={<PieChartPage />} />
              <Route path="/bi/donut" element={<DonutChartPage />} />
              <Route path="/bi/radar" element={<RadarChartPage />} />
              <Route path="/bi/scatter" element={<ScatterChartPage />} />
              <Route path="/bi/bubble" element={<BubbleChartPage />} />
              <Route path="/bi/treemap" element={<TreemapChartPage />} />
              <Route path="/bi/sankey" element={<SankeyChartPage />} />
              <Route path="/bi/radialbar" element={<RadialBarChartPage />} />
              <Route path="/bi/stackedarea" element={<StackedAreaChartPage />} />
              <Route path="/bi/gauge" element={<GaugeChartPage />} />
              <Route path="/bi/timeline" element={<TimelineChartPage />} />
              <Route path="/bi/bullet" element={<BulletChartPage />} />
              <Route path="/bi/polararea" element={<PolarAreaChartPage />} />
              <Route path="/bi/competitive" element={<CompetitivePositioningPage />} />
              <Route path="/bi/swot" element={<SWOTAnalysisPage />} />
              <Route path="/bi/risk" element={<RiskMatrixPage />} />
              <Route path="/bi/pestle" element={<PestleAnalysisPage />} />

              {/* Data Science */}
              <Route path="/ds/forecast" element={<ForecastBandPage />} />
              <Route path="/ds/anomaly" element={<AnomalyTimelinePage />} />
              <Route path="/ds/histogram" element={<HistogramChartPage />} />
              <Route path="/ds/boxplot" element={<BoxPlotChartPage />} />
              <Route path="/ds/heatmap" element={<HeatmapChartPage />} />
              <Route path="/ds/control" element={<ControlChartPage />} />
              <Route path="/ds/violin" element={<ViolinChartPage />} />
              <Route path="/ds/candlestick" element={<CandlestickChartPage />} />
              <Route path="/ds/volcano" element={<VolcanoPlotPage />} />

              {/* Geo */}
              <Route path="/geo/choropleth" element={<ChoroplethMapPage />} />
              <Route path="/geo/bubblemap" element={<BubbleMapPage />} />
              <Route path="/geo/connectionmap" element={<ConnectionMapPage />} />
              <Route path="/geo/tilemap" element={<TileMapPage />} />

              {/* Network */}
              <Route path="/network/graph" element={<NetworkGraphPage />} />
              <Route path="/network/tree" element={<DependencyTreePage />} />
              <Route path="/network/chord" element={<ChordDiagramPage />} />

              {/* AI */}
              <Route path="/ai/insight" element={<InsightCardPage />} />
              <Route path="/ai/recommendation" element={<RecommendationCardPage />} />

              {/* Flow */}
              <Route path="/flow/diagram" element={<FlowDiagramPage />} />

              {/* Infographics */}
              <Route path="/infographics/showcase" element={<InfographicsShowcasePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}
