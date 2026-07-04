import React from 'react';
import { LayoutDashboard, MessageSquare, LineChart, AlertTriangle, Camera, Workflow, Database, Server, FileSpreadsheet, DollarSign, Cloud, Code, BrainCircuit } from 'lucide-react';

export const DecisionIntelligenceSystem: React.FC = () => {
  const pillars = [
    { label: 'Decision Dashboards', icon: LayoutDashboard },
    { label: 'Talk-to-Data Interfaces', icon: MessageSquare },
    { label: 'Forecasting Models', icon: LineChart },
    { label: 'Anomaly Detection', icon: AlertTriangle },
    { label: 'Computer Vision', icon: Camera },
    { label: 'Custom AI Workflows', icon: Workflow },
  ];

  const foundation = [
    { label: 'ERP & Databases', icon: Database },
    { label: 'CRM & HRIS', icon: Server },
    { label: 'Spreadsheets', icon: FileSpreadsheet },
    { label: 'Finance Systems', icon: DollarSign },
    { label: 'Cloud Platforms', icon: Cloud },
    { label: 'Custom APIs', icon: Code },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-12 bg-[#0E2419] border border-[#03481E] rounded-lg font-sans my-10 shadow-lg">
      <div className="mb-10 md:mb-14 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">AI Byters Decision Intelligence System</h3>
        <p className="text-[#C5EEB5] font-bold text-sm md:text-lg tracking-widest uppercase">See. Ask. Predict. Detect. Act.</p>
      </div>

      <div className="flex flex-col gap-8 md:gap-10 items-center w-full max-w-4xl mx-auto">
        
        {/* Pillars */}
        <div className="w-full">
          <div className="text-[#C5EEB5] text-sm font-bold uppercase tracking-widest mb-5 text-center">Capabilities</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 w-full">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-white border-2 border-[#DEE4E1] p-4 md:p-5 rounded-lg flex flex-col items-center justify-center text-center gap-3 shadow-sm transition-transform hover:-translate-y-1">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#009B57]" />
                  <span className="text-[#0E2419] font-bold text-sm md:text-base leading-tight">{pillar.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Central Intelligence Layer */}
        <div className="w-full bg-[#03481E] border-4 border-[#C5EEB5] p-6 md:p-8 rounded-xl text-center flex flex-col items-center justify-center shadow-xl my-2 md:my-4 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-[#03481E]"></div>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-[#03481E]"></div>
          
          <BrainCircuit className="w-12 h-12 md:w-16 md:h-16 text-white mb-3 md:mb-4" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider leading-tight">Decision Intelligence</h2>
          <p className="text-[#ECF8E9] mt-2 md:mt-3 font-semibold text-base md:text-lg tracking-wide">One Connected Intelligence Layer</p>
        </div>

        {/* Foundation */}
        <div className="w-full">
          <div className="text-[#C5EEB5] text-sm font-bold uppercase tracking-widest mb-5 text-center">Data Foundation</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 w-full">
            {foundation.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-[#1B5537] border-2 border-[#159052] p-4 md:p-5 rounded-lg flex flex-col items-center justify-center text-center gap-2 md:gap-3 shadow-md">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-[#C5EEB5]" />
                  <span className="text-white font-bold text-xs md:text-sm tracking-wide leading-tight">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
