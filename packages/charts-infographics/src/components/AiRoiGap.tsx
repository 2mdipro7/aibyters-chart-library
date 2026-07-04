import React from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const AiRoiGap: React.FC = () => {
  const rows = [
    { promise: 'Faster decisions', reality: 'More manual checking' },
    { promise: 'Lower costs', reality: 'Higher hidden implementation costs' },
    { promise: 'Better forecasting', reality: 'Weak predictions from poor data' },
    { promise: 'Automation', reality: 'Employees still repeat manual work' },
    { promise: 'Competitive advantage', reality: 'Pilots never reach production' },
    { promise: 'Smarter decisions', reality: 'Outputs are not trusted' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-[#F6FAF4] border border-[#DEE4E1] rounded-lg font-sans shadow-sm my-10">
      <div className="mb-6 md:mb-8 text-center">
        <h3 className="text-xl md:text-3xl font-bold text-[#0E2419] mb-2 md:mb-3">The AI ROI Gap</h3>
        <p className="text-[#4A5F52] text-sm md:text-lg max-w-2xl mx-auto">AI creates value only when it improves decisions, workflows, and measurable outcomes.</p>
      </div>

      <div className="grid grid-cols-2 gap-x-3 md:gap-x-8 gap-y-3 md:gap-y-5 items-stretch relative">
        <div className="font-bold text-[#03481E] text-sm md:text-xl px-2 md:px-6 py-2 md:py-4 border-b-2 md:border-b-4 border-[#009B57] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 text-center leading-tight">
          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#009B57]" />
          <span>AI Promise</span>
        </div>
        
        <div className="font-bold text-[#7A0506] text-sm md:text-xl px-2 md:px-6 py-2 md:py-4 border-b-2 md:border-b-4 border-[#E61B2B] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 text-center leading-tight">
          <XCircle className="w-5 h-5 md:w-6 md:h-6 text-[#E61B2B]" />
          <span>Business Reality</span>
        </div>

        {rows.map((row, idx) => (
          <React.Fragment key={idx}>
            <div className="bg-white border-2 border-[#DEE4E1] p-3 md:p-5 rounded-md shadow-sm text-[#0E2419] font-bold md:font-semibold text-center h-full flex items-center justify-center text-xs sm:text-sm md:text-lg leading-snug">
              {row.promise}
            </div>
            
            <div className="bg-[#F9E4E4] border-2 border-[#C5696A] p-3 md:p-5 rounded-md shadow-sm text-[#7A0506] font-bold md:font-semibold text-center h-full flex items-center justify-center text-xs sm:text-sm md:text-lg leading-snug relative">
               {/* Arrow perfectly centered on the left border of this column */}
               <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 md:p-1 z-10 border border-[#DEE4E1] flex items-center justify-center shadow-sm">
                 <ArrowRight className="w-3 h-3 md:w-6 md:h-6 text-[#159052]" strokeWidth={3} />
               </div>
              {row.reality}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
