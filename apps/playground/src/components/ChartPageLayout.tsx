import React from 'react';

interface ChartPageLayoutProps {
  title: string;
  description: string;
  category: string;
  code: string;
  children: React.ReactNode;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  kpi: { label: 'KPI', color: '#6366f1' },
  bi: { label: 'BI Chart', color: '#06b6d4' },
  ds: { label: 'Data Science', color: '#22c55e' },
  geo: { label: 'Map', color: '#f59e0b' },
  network: { label: 'Network', color: '#ec4899' },
  ai: { label: 'AI', color: '#8b5cf6' },
};

export function ChartPageLayout({ title, description, category, code, children }: ChartPageLayoutProps) {
  const cat = categoryLabels[category] || { label: category, color: '#64748b' };

  return (
    <div className="chart-page">
      <div className="chart-page-header">
        <span className="chart-page-badge" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
          {cat.label}
        </span>
        <h1 className="chart-page-title">{title}</h1>
        <p className="chart-page-description">{description}</p>
      </div>

      <div className="chart-page-section">
        <h2 className="chart-page-section-title">Live Demo</h2>
        <div className="chart-page-demo">
          {children}
        </div>
      </div>

      <div className="chart-page-section">
        <h2 className="chart-page-section-title">Usage</h2>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <button className="code-block-copy" onClick={handleCopy}>
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      <pre><code>{code}</code></pre>
    </div>
  );
}
