import React from "react";
import { WidgetCard } from "@aibyters/layout";

export interface PestleAnalysisCardProps {
  title: string;
  description?: string;
  data: {
    political: string[];
    economic: string[];
    sociocultural: string[];
    technological: string[];
    legal: string[];
    environmental: string[];
  };
  className?: string;
}

export function PestleAnalysisCard({
  title,
  description,
  data,
  className
}: PestleAnalysisCardProps) {
  
  const factors = [
    { id: "political", title: "Political", items: data.political, color: "#ef4444" },
    { id: "economic", title: "Economic", items: data.economic, color: "#f59e0b" },
    { id: "sociocultural", title: "Sociocultural", items: data.sociocultural, color: "#8b5cf6" },
    { id: "technological", title: "Technological", items: data.technological, color: "#06b6d4" },
    { id: "legal", title: "Legal", items: data.legal, color: "#6366f1" },
    { id: "environmental", title: "Environmental", items: data.environmental, color: "#22c55e" },
  ];

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "16px",
        width: "100%",
        padding: "8px 0"
      }}>
        {factors.map(factor => (
          <div key={factor.id} style={{
            backgroundColor: "var(--vi-color-surface-background)",
            border: "1px solid var(--vi-color-surface-borderLight)",
            borderTop: `4px solid ${factor.color}`,
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}>
            <h4 style={{ 
              margin: 0, 
              color: "var(--vi-color-text-primary)", 
              fontSize: "14px", 
              fontWeight: 700, 
              letterSpacing: "0.5px" 
            }}>
              {factor.title}
            </h4>
            <ul style={{ 
              margin: 0, 
              paddingLeft: "20px", 
              color: "var(--vi-color-text-secondary)", 
              fontSize: "13px",
              lineHeight: 1.6
            }}>
              {factor.items.map((item, i) => (
                <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
              ))}
              {factor.items.length === 0 && (
                <li style={{ listStyle: "none", color: "var(--vi-color-text-tertiary)", fontStyle: "italic", marginLeft: "-20px" }}>No items</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
