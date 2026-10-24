import React, { useRef, useState } from 'react';
import { FlowChart, winsupplyDueDiligenceTemplate } from '@aibyters/charts-flow';
import { Maximize, Minimize } from 'lucide-react';

export default function FlowDiagramPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for escape key exits
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="flow-demo-page">
      <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: 'var(--vi-color-text-primary)', marginBottom: '8px' }}>
            Flow Diagram
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--vi-color-text-secondary)', fontFamily: "'Inter', sans-serif" }}>
            Interactive flowcharts and process diagrams with pan, zoom, and drag capabilities.
          </p>
        </div>
        <button 
          onClick={toggleFullscreen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'white',
            border: '1px solid #DEE4E1',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#10261A',
            fontWeight: 600,
            fontSize: '14px',
            flexShrink: 0,
            maxWidth: '100%'
          }}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
      <div 
        ref={containerRef}
        style={{ 
        width: '100%', 
        height: isFullscreen ? '100vh' : 'calc(100vh - 180px)', 
        borderRadius: isFullscreen ? '0' : '16px', 
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid var(--vi-color-surface-border)',
        background: 'var(--vi-color-surface-elevated)'
      }}>
        <FlowChart 
          template={winsupplyDueDiligenceTemplate}
          interactive={true}
          showMinimap={true}
          showControls={true}
          showBackground={true}
        />
      </div>
    </div>
  );
}
