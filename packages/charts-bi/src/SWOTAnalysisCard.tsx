import { WidgetCard } from "@aibyters/layout";

export interface SWOTAnalysisCardProps {
  title: string;
  description?: string;
  data: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  className?: string;
}

export function SWOTAnalysisCard({
  title,
  description,
  data,
  className
}: SWOTAnalysisCardProps) {
  
  const Quadrant = ({ title, items, color, bgColor }: { title: string, items: string[], color: string, bgColor: string }) => (
    <div style={{
      backgroundColor: bgColor,
      border: `1px solid ${color}`,
      borderRadius: "8px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      height: "100%"
    }}>
      <h4 style={{ 
        margin: 0, 
        color: color, 
        fontSize: "14px", 
        fontWeight: 700, 
        textTransform: "uppercase", 
        letterSpacing: "0.5px" 
      }}>
        {title}
      </h4>
      <ul style={{ 
        margin: 0, 
        paddingLeft: "20px", 
        color: "var(--vi-color-text-secondary)", 
        fontSize: "13px",
        lineHeight: 1.6
      }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
        ))}
        {items.length === 0 && (
          <li style={{ listStyle: "none", color: "var(--vi-color-text-tertiary)", fontStyle: "italic", marginLeft: "-20px" }}>No items</li>
        )}
      </ul>
    </div>
  );

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gridTemplateRows: "1fr 1fr", 
        gap: "16px",
        width: "100%",
        minHeight: "350px",
        padding: "8px"
      }}>
        <Quadrant 
          title="Strengths" 
          items={data.strengths} 
          color="var(--vi-color-positive-main, #22c55e)" 
          bgColor="rgba(34, 197, 94, 0.05)" 
        />
        <Quadrant 
          title="Weaknesses" 
          items={data.weaknesses} 
          color="var(--vi-color-warning-main, #f59e0b)" 
          bgColor="rgba(245, 158, 11, 0.05)" 
        />
        <Quadrant 
          title="Opportunities" 
          items={data.opportunities} 
          color="var(--vi-color-info-main, #06b6d4)" 
          bgColor="rgba(6, 182, 212, 0.05)" 
        />
        <Quadrant 
          title="Threats" 
          items={data.threats} 
          color="var(--vi-color-critical-main, #ef4444)" 
          bgColor="rgba(239, 68, 68, 0.05)" 
        />
      </div>
    </WidgetCard>
  );
}
