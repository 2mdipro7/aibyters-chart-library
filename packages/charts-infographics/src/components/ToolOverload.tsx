import React from 'react';
import { Layers, Network, X, Check } from 'lucide-react';

export const ToolOverload: React.FC = () => {
  const overload = [
    "Many disconnected tools",
    "Outputs copied manually",
    "Employees check everything again",
    "Dashboards show what happened",
    "AI is used separately",
    "ROI is unclear"
  ];
  
  const intelligence = [
    "One connected intelligence layer",
    "Insights flow into workflows",
    "Confidence and source traceability are built in",
    "Systems help explain what changed",
    "AI is embedded into business decisions",
    "Outcomes are measured continuously"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-10 bg-[#F6FAF4] border border-[#DEE4E1] rounded-lg font-sans my-10 shadow-sm">
      <div className="mb-12 text-center">
        <h3 className="text-3xl font-bold text-[#0E2419] mb-3">Tool Overload vs Decision Intelligence</h3>
        <p className="text-[#4A5F52] text-lg max-w-2xl mx-auto">The answer is not more tools. The answer is better integration around decisions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Tool Overload */}
        <div className="bg-white border-2 border-[#C5696A] rounded-lg overflow-hidden flex flex-col shadow-sm">
          <div className="bg-[#A30A0C] p-5 flex items-center justify-center gap-3 text-white border-b-2 border-[#7A0506]">
            <Layers className="w-7 h-7" />
            <h4 className="text-xl font-bold tracking-wide">Tool Overload</h4>
          </div>
          <div className="p-8 flex-grow">
            <ul className="space-y-6">
              {overload.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-0.5 bg-[#F9E4E4] p-1.5 rounded-md border border-[#C5696A] flex-shrink-0">
                    <X className="w-5 h-5 text-[#A30A0C]" strokeWidth={3} />
                  </div>
                  <span className="text-[#7A0506] font-semibold text-lg leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decision Intelligence */}
        <div className="bg-white border-2 border-[#009B57] rounded-lg overflow-hidden flex flex-col shadow-sm">
          <div className="bg-[#03481E] p-5 flex items-center justify-center gap-3 text-white border-b-2 border-[#009B57]">
            <Network className="w-7 h-7 text-[#C5EEB5]" />
            <h4 className="text-xl font-bold tracking-wide">Decision Intelligence</h4>
          </div>
          <div className="p-8 flex-grow">
            <ul className="space-y-6">
              {intelligence.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-0.5 bg-[#ECF8E9] p-1.5 rounded-md border border-[#159052] flex-shrink-0">
                    <Check className="w-5 h-5 text-[#009B57]" strokeWidth={3} />
                  </div>
                  <span className="text-[#0E2419] font-semibold text-lg leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
