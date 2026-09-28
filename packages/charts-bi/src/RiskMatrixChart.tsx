import { WidgetCard } from "@aibyters/layout";

export interface RiskMatrixChartProps {
  title: string;
  description?: string;
  data: Array<{
    id: string;
    name: string;
    likelihood: 1 | 2 | 3 | 4 | 5; // 1: Rare, 5: Almost Certain
    impact: 1 | 2 | 3 | 4 | 5; // 1: Insignificant, 5: Severe
  }>;
  className?: string;
}

export function RiskMatrixChart({
  title,
  description,
  data,
  className
}: RiskMatrixChartProps) {
  
  // 5x5 grid cells
  const gridSize = 5;
  const cells = Array.from({ length: gridSize * gridSize }, (_, i) => {
    // x is impact (1-5), y is likelihood (5-1)
    const x = (i % gridSize) + 1;
    const y = gridSize - Math.floor(i / gridSize);
    
    // Severity = Likelihood x Impact. Max 25.
    const severity = x * y;
    let bgColor = "rgba(34, 197, 94, 0.15)"; // Green (Low)
    let borderColor = "var(--vi-color-positive-main, #22c55e)";
    
    if (severity >= 15) {
      bgColor = "rgba(239, 68, 68, 0.15)"; // Red (High)
      borderColor = "var(--vi-color-critical-main, #ef4444)";
    } else if (severity >= 8) {
      bgColor = "rgba(245, 158, 11, 0.15)"; // Yellow (Medium)
      borderColor = "var(--vi-color-warning-main, #f59e0b)";
    }

    return { x, y, bgColor, borderColor };
  });

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: "100%", position: "relative", padding: "20px 0 0 20px" }}>
        
        {/* Y Axis Label */}
        <div style={{
          position: "absolute",
          left: -10,
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--vi-color-text-secondary)"
        }}>
          Likelihood
        </div>

        {/* X Axis Label */}
        <div style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--vi-color-text-secondary)"
        }}>
          Impact
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(5, 1fr)", 
          gridTemplateRows: "repeat(5, 1fr)", 
          gap: "4px",
          width: "100%",
          height: "300px"
        }}>
          {cells.map((cell) => {
            const itemsInCell = data.filter(d => d.likelihood === cell.y && d.impact === cell.x);
            
            return (
              <div key={`${cell.x}-${cell.y}`} style={{
                backgroundColor: cell.bgColor,
                border: `1px solid ${cell.borderColor}`,
                borderRadius: "4px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "4px",
                position: "relative"
              }}>
                {itemsInCell.map(item => (
                  <div 
                    key={item.id}
                    title={item.name}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "var(--vi-color-surface-card)",
                      border: `2px solid ${cell.borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "var(--vi-color-text-primary)",
                      cursor: "help",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                  >
                    {item.id}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "32px", fontSize: "12px" }}>
        {data.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--vi-color-text-secondary)" }}>{item.id}:</span>
            <span style={{ color: "var(--vi-color-text-primary)" }}>{item.name}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
