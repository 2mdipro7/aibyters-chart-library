export interface ChartEntry {
  id: string;
  name: string;
  category: 'kpi' | 'bi' | 'ds' | 'geo' | 'network' | 'ai';
  path: string;
  description: string;
  status: 'implemented' | 'planned';
}

export interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  { id: 'kpi', label: 'KPI Cards', icon: '📊', description: 'Key performance indicators and metric displays' },
  { id: 'bi', label: 'BI Charts', icon: '📈', description: 'Business intelligence and analytical charts' },
  { id: 'ds', label: 'Data Science', icon: '🔬', description: 'Statistical and data science visualizations' },
  { id: 'geo', label: 'Maps', icon: '🗺️', description: 'Geographic and spatial visualizations' },
  { id: 'network', label: 'Network', icon: '🕸️', description: 'Network graphs and relationship diagrams' },
  { id: 'ai', label: 'AI Cards', icon: '🤖', description: 'AI-generated insights and recommendations' },
];

export const chartRegistry: ChartEntry[] = [
  // KPI Cards
  { id: 'metric', name: 'Metric Card', category: 'kpi', path: '/kpi/metric', description: 'Single KPI value with formatting', status: 'implemented' },
  { id: 'delta', name: 'Delta Card', category: 'kpi', path: '/kpi/delta', description: 'Value with change indicator (↑↓)', status: 'implemented' },
  { id: 'target', name: 'Target Card', category: 'kpi', path: '/kpi/target', description: 'Progress toward a target goal', status: 'implemented' },
  { id: 'sparkline', name: 'Sparkline Card', category: 'kpi', path: '/kpi/sparkline', description: 'Inline micro line chart in a card', status: 'implemented' },
  { id: 'severity', name: 'Severity Card', category: 'kpi', path: '/kpi/severity', description: 'Status indicator with severity levels', status: 'implemented' },
  { id: 'progress', name: 'Progress Card', category: 'kpi', path: '/kpi/progress', description: 'Circular or linear progress indicator', status: 'implemented' },

  // BI Charts (New Frameworks)
  { id: 'competitive', name: 'Competitive Matrix', category: 'bi', path: '/bi/competitive', description: '2x2 scatter quadrant matrix', status: 'implemented' },
  { id: 'swot', name: 'SWOT Analysis', category: 'bi', path: '/bi/swot', description: 'Strategic 2x2 framework layout', status: 'implemented' },
  { id: 'risk', name: 'Risk Matrix', category: 'bi', path: '/bi/risk', description: '5x5 likelihood vs impact grid', status: 'implemented' },
  { id: 'pestle', name: 'PESTLE Analysis', category: 'bi', path: '/bi/pestle', description: 'Macro-environmental factors', status: 'implemented' },
  // Existing BI Charts
  { id: 'line', name: 'Line Chart', category: 'bi', path: '/bi/line', description: 'Multi-series line chart for trends', status: 'implemented' },
  { id: 'area', name: 'Area Chart', category: 'bi', path: '/bi/area', description: 'Filled area chart for volume trends', status: 'implemented' },
  { id: 'bar', name: 'Bar Chart', category: 'bi', path: '/bi/bar', description: 'Horizontal bar chart for comparisons', status: 'implemented' },
  { id: 'column', name: 'Column Chart', category: 'bi', path: '/bi/column', description: 'Vertical bar chart for categories', status: 'implemented' },
  { id: 'combo', name: 'Combo Chart', category: 'bi', path: '/bi/combo', description: 'Bar + line overlay chart', status: 'implemented' },
  { id: 'funnel', name: 'Funnel Chart', category: 'bi', path: '/bi/funnel', description: 'Conversion funnel visualization', status: 'implemented' },
  { id: 'table', name: 'Data Table', category: 'bi', path: '/bi/table', description: 'Sortable data table with formatting', status: 'implemented' },
  { id: 'waterfall', name: 'Waterfall Chart', category: 'bi', path: '/bi/waterfall', description: 'Incremental value contributions', status: 'implemented' },
  { id: 'matrix', name: 'Matrix Table', category: 'bi', path: '/bi/matrix', description: 'Pivot table with heatmap coloring', status: 'implemented' },
  { id: 'pie', name: 'Pie Chart', category: 'bi', path: '/bi/pie', description: 'Part-of-whole circular chart', status: 'implemented' },
  { id: 'donut', name: 'Donut Chart', category: 'bi', path: '/bi/donut', description: 'Pie chart with center label', status: 'implemented' },
  { id: 'radar', name: 'Radar Chart', category: 'bi', path: '/bi/radar', description: 'Multi-dimensional comparison spider', status: 'implemented' },
  { id: 'scatter', name: 'Scatter Chart', category: 'bi', path: '/bi/scatter', description: 'XY scatter plot for correlations', status: 'implemented' },
  { id: 'bubble', name: 'Bubble Chart', category: 'bi', path: '/bi/bubble', description: 'Scatter with area-encoded dimension', status: 'implemented' },
  { id: 'treemap', name: 'Treemap Chart', category: 'bi', path: '/bi/treemap', description: 'Hierarchical area chart', status: 'implemented' },
  { id: 'sankey', name: 'Sankey Chart', category: 'bi', path: '/bi/sankey', description: 'Flow diagram between stages', status: 'implemented' },
  { id: 'radialbar', name: 'Radial Bar Chart', category: 'bi', path: '/bi/radialbar', description: 'Circular bar comparison', status: 'implemented' },
  { id: 'stackedarea', name: 'Stacked Area Chart', category: 'bi', path: '/bi/stackedarea', description: 'Composition over time', status: 'implemented' },
  { id: 'gauge', name: 'Gauge Chart', category: 'bi', path: '/bi/gauge', description: 'Semi-circular meter display', status: 'implemented' },
  { id: 'timeline', name: 'Timeline Chart', category: 'bi', path: '/bi/timeline', description: 'Horizontal event timeline', status: 'implemented' },
  { id: 'bullet', name: 'Bullet Chart', category: 'bi', path: '/bi/bullet', description: 'Actual vs target with ranges', status: 'implemented' },
  { id: 'polararea', name: 'Polar Area Chart', category: 'bi', path: '/bi/polararea', description: 'Coxcomb / Nightingale rose', status: 'implemented' },

  // Data Science
  { id: 'forecast', name: 'Forecast Band', category: 'ds', path: '/ds/forecast', description: 'Prediction with confidence intervals', status: 'implemented' },
  { id: 'anomaly', name: 'Anomaly Timeline', category: 'ds', path: '/ds/anomaly', description: 'Automated spike detection', status: 'implemented' },
  { id: 'histogram', name: 'Histogram Chart', category: 'ds', path: '/ds/histogram', description: 'Frequency distribution', status: 'implemented' },
  { id: 'boxplot', name: 'Box Plot Chart', category: 'ds', path: '/ds/boxplot', description: 'Quartiles, median, outliers', status: 'implemented' },
  { id: 'heatmap', name: 'Heatmap Chart', category: 'ds', path: '/ds/heatmap', description: '2D color-intensity matrix', status: 'implemented' },
  { id: 'control', name: 'Control Chart', category: 'ds', path: '/ds/control', description: 'Statistical process control', status: 'implemented' },
  { id: 'violin', name: 'Violin Chart', category: 'ds', path: '/ds/violin', description: 'Distribution shape visualization', status: 'implemented' },
  { id: 'candlestick', name: 'Candlestick Chart', category: 'ds', path: '/ds/candlestick', description: 'Financial OHLC chart', status: 'implemented' },
  { id: 'volcano', name: 'Volcano Plot', category: 'ds', path: '/ds/volcano', description: 'Differential expression scatter', status: 'implemented' },

  // Geographic
  { id: 'choropleth', name: 'Choropleth Map', category: 'geo', path: '/geo/choropleth', description: 'Color-coded regional map', status: 'implemented' },
  { id: 'bubblemap', name: 'Bubble Map', category: 'geo', path: '/geo/bubblemap', description: 'Sized bubbles on geographic map', status: 'implemented' },
  { id: 'connectionmap', name: 'Connection Map', category: 'geo', path: '/geo/connectionmap', description: 'Arc lines between locations', status: 'implemented' },
  { id: 'tilemap', name: 'Tile Map', category: 'geo', path: '/geo/tilemap', description: 'Interactive GIS Leaflet map', status: 'implemented' },

  // Network
  { id: 'networkgraph', name: 'Network Graph', category: 'network', path: '/network/graph', description: 'Force-directed relationship graph', status: 'implemented' },
  { id: 'tree', name: 'Dependency Tree', category: 'network', path: '/network/tree', description: 'Hierarchical tree layout', status: 'implemented' },
  { id: 'chord', name: 'Chord Diagram', category: 'network', path: '/network/chord', description: 'Circular relationship matrix', status: 'implemented' },

  // AI Cards
  { id: 'insight', name: 'Insight Card', category: 'ai', path: '/ai/insight', description: 'AI-generated insight display', status: 'implemented' },
  { id: 'recommendation', name: 'Recommendation Card', category: 'ai', path: '/ai/recommendation', description: 'Actionable AI recommendation', status: 'implemented' },
];

export function getChartsByCategory(category: string): ChartEntry[] {
  return chartRegistry.filter(c => c.category === category);
}

export function searchCharts(query: string): ChartEntry[] {
  const q = query.toLowerCase();
  return chartRegistry.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  );
}
