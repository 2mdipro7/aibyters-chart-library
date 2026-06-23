import React from 'react';
import { Link } from 'react-router-dom';
import { categories, chartRegistry, getChartsByCategory, type ChartEntry } from '../data/chart-registry';

export default function Overview() {
  return (
    <div className="overview">
      <div className="overview-header">
        <h1 className="overview-title">AI Byters Chart Library</h1>
        <p className="overview-subtitle">
          A comprehensive collection of {chartRegistry.length} visualization components for business intelligence, 
          data science, geographic mapping, network analysis, and AI-powered insights.
        </p>
        <div className="overview-stats">
          <div className="overview-stat">
            <span className="overview-stat-value">{chartRegistry.length}</span>
            <span className="overview-stat-label">Charts</span>
          </div>
          <div className="overview-stat">
            <span className="overview-stat-value">{categories.length}</span>
            <span className="overview-stat-label">Categories</span>
          </div>
          <div className="overview-stat">
            <span className="overview-stat-value">5</span>
            <span className="overview-stat-label">Packages</span>
          </div>
        </div>
      </div>

      {categories.map(cat => {
        const charts = getChartsByCategory(cat.id);
        return (
          <div key={cat.id} className="overview-category">
            <div className="overview-category-header">
              <span className="overview-category-icon">{cat.icon}</span>
              <h2 className="overview-category-title">{cat.label}</h2>
              <span className="overview-category-count">{charts.length} charts</span>
            </div>
            <p className="overview-category-desc">{cat.description}</p>
            <div className="overview-grid">
              {charts.map(chart => (
                <ChartThumbnail key={chart.id} chart={chart} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChartThumbnail({ chart }: { chart: ChartEntry }) {
  const categoryColors: Record<string, string> = {
    kpi: '#6366f1',
    bi: '#06b6d4',
    ds: '#22c55e',
    geo: '#f59e0b',
    network: '#ec4899',
    ai: '#8b5cf6',
  };

  const color = categoryColors[chart.category] || '#64748b';

  return (
    <Link to={chart.path} className="chart-thumbnail">
      <div className="chart-thumbnail-preview" style={{ borderColor: `${color}40` }}>
        <span className="chart-thumbnail-icon" style={{ color }}>{getChartIcon(chart.id)}</span>
      </div>
      <div className="chart-thumbnail-info">
        <h3 className="chart-thumbnail-name">{chart.name}</h3>
        <p className="chart-thumbnail-desc">{chart.description}</p>
      </div>
    </Link>
  );
}

function getChartIcon(id: string): string {
  const icons: Record<string, string> = {
    metric: '▣', delta: '△', target: '◎', sparkline: '〜', severity: '⚠', progress: '◔',
    line: '📈', area: '▧', bar: '▬', column: '▮', combo: '📊', funnel: '▽',
    table: '▦', waterfall: '▤', matrix: '⊞', pie: '◕', donut: '◑', radar: '◇',
    scatter: '⁘', bubble: '◉', treemap: '▩', sankey: '⇶', radialbar: '◐', stackedarea: '▨',
    gauge: '◓', timeline: '⟼', bullet: '▶', polararea: '✿',
    forecast: '⟿', anomaly: '⚡', histogram: '▥', boxplot: '⊡', heatmap: '▦',
    control: '⊶', violin: '♪', candlestick: '⫞',
    choropleth: '🌍', bubblemap: '📍', connectionmap: '✈',
    networkgraph: '⬡', tree: '⎔', chord: '⊛',
    insight: '💡', recommendation: '🎯',
  };
  return icons[id] || '📊';
}
