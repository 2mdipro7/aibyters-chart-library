import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { categories, getChartsByCategory } from '../data/chart-registry';

export function Sidebar({ searchQuery }: { searchQuery: string }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = categories.map(cat => {
    const charts = getChartsByCategory(cat.id);
    const filtered = searchQuery
      ? charts.filter(c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : charts;
    return { ...cat, charts: filtered };
  }).filter(cat => cat.charts.length > 0);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo">
          <span className="sidebar-logo-icon">◆</span>
          <span className="sidebar-logo-text">AI Byters Charts (V2)</span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar-link sidebar-overview ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-link-icon">🏠</span>
          <span>Overview</span>
        </NavLink>

        {filteredCategories.map(cat => (
          <div key={cat.id} className="sidebar-category">
            <button
              className="sidebar-category-header"
              onClick={() => toggleCategory(cat.id)}
            >
              <span className="sidebar-link-icon">{cat.icon}</span>
              <span className="sidebar-category-label">{cat.label}</span>
              <span className="sidebar-category-count">{cat.charts.length}</span>
              <span className={`sidebar-chevron ${collapsed[cat.id] ? 'collapsed' : ''}`}>▾</span>
            </button>

            {!collapsed[cat.id] && (
              <div className="sidebar-category-items">
                {cat.charts.map(chart => (
                  <NavLink
                    key={chart.id}
                    to={chart.path}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <span>{chart.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
