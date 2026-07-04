import React from 'react';
import { AlertTriangle, TrendingDown, Database, Wrench, RefreshCw, Users, ShieldAlert, BarChart2, Clock } from 'lucide-react';

export const HiddenCost: React.FC = () => {
  const costs = [
    { label: 'Failed pilots', icon: TrendingDown },
    { label: 'Bad data', icon: Database },
    { label: 'Tool overload', icon: Wrench },
    { label: 'Manual rework', icon: RefreshCw },
    { label: 'Low adoption', icon: Users },
    { label: 'Governance risk', icon: ShieldAlert },
    { label: 'No ROI tracking', icon: BarChart2 },
    { label: 'Slow decisions', icon: Clock },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-[#0E2419] border border-[#03481E] rounded-lg font-sans flex flex-col items-center my-10 shadow-sm">
      <div className="mb-8 md:mb-12 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">The Hidden Cost of Bad AI Integration</h3>
        <p className="text-[#DEE4E1] text-base md:text-lg max-w-2xl mx-auto">The largest cost of failed AI is not the software. It is the decision-making that never gets better.</p>
      </div>

      {/* Desktop Layout (Circle) */}
      <div className="hidden md:flex relative w-full max-w-2xl h-[500px] items-center justify-center">
        {/* Connecting Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {costs.map((_, idx) => {
            const angle = (idx * 360) / costs.length;
            const rad = (angle * Math.PI) / 180;
            const radiusPercent = 40; // distance from center
            const left = 50 + Math.cos(rad) * radiusPercent;
            const top = 50 + Math.sin(rad) * radiusPercent;
            return (
              <line
                key={idx}
                x1="50%"
                y1="50%"
                x2={`${left}%`}
                y2={`${top}%`}
                stroke="#159052"
                strokeWidth="2"
                strokeOpacity="0.6"
              />
            );
          })}
        </svg>

        {/* Center Node */}
        <div className="z-10 w-52 h-52 bg-[#A30A0C] border-4 border-[#E61B2B] rounded-full flex flex-col items-center justify-center text-center shadow-lg p-6 relative">
          <AlertTriangle className="w-12 h-12 text-white mb-2" />
          <span className="text-white font-bold text-xl leading-tight">Failed AI<br/>Integration</span>
        </div>

        {/* Branches */}
        {costs.map((cost, idx) => {
          const angle = (idx * 360) / costs.length;
          const rad = (angle * Math.PI) / 180;
          const radiusPercent = 40; // keep synchronized with SVG lines
          const left = 50 + Math.cos(rad) * radiusPercent;
          const top = 50 + Math.sin(rad) * radiusPercent;
          const Icon = cost.icon;
          
          return (
            <div
              key={idx}
              className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div className="bg-[#1B5537] border-2 border-[#159052] px-5 py-3 rounded-lg flex items-center gap-3 text-white shadow-md">
                <Icon className="w-6 h-6 text-[#C5EEB5]" />
                <span className="text-base font-semibold whitespace-nowrap">{cost.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Layout (Grid) */}
      <div className="md:hidden w-full flex flex-col items-center gap-6">
        <div className="w-40 h-40 bg-[#A30A0C] border-4 border-[#E61B2B] rounded-full flex flex-col items-center justify-center text-center shadow-lg p-4">
          <AlertTriangle className="w-10 h-10 text-white mb-2" />
          <span className="text-white font-bold text-base leading-tight">Failed AI<br/>Integration</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 w-full">
          {costs.map((cost, idx) => {
            const Icon = cost.icon;
            return (
              <div key={idx} className="bg-[#1B5537] border-2 border-[#159052] p-3 rounded-lg flex flex-col items-center justify-center text-center gap-2 text-white shadow-md">
                <Icon className="w-6 h-6 text-[#C5EEB5]" />
                <span className="text-sm font-semibold leading-tight">{cost.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
