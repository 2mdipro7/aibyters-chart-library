import React from 'react';
import { Lightbulb, Rocket, MonitorPlay, Zap, Database, AlertCircle, XOctagon, RotateCcw, ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';

export const PilotPurgatory: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-10 bg-[#F6FAF4] border border-[#DEE4E1] rounded-lg font-sans my-10 shadow-sm">
      <div className="mb-16 text-center">
        <h3 className="text-3xl font-bold text-[#0E2419] mb-3">The Pilot Purgatory Loop</h3>
        <p className="text-[#A30A0C] font-semibold text-lg max-w-2xl mx-auto uppercase tracking-wide">Expensive motion. No measurable value.</p>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] grid-rows-[1fr_auto_1fr] gap-y-6 gap-x-4 items-center justify-items-center max-w-4xl mx-auto">
        {/* Row 1 */}
        <StepCard icon={Lightbulb} title="Idea" state="neutral" />
        <ArrowRight className="text-[#159052] w-8 h-8" strokeWidth={2.5} />
        <StepCard icon={Rocket} title="Pilot" state="neutral" />
        <ArrowRight className="text-[#159052] w-8 h-8" strokeWidth={2.5} />
        <StepCard icon={MonitorPlay} title="Demo" state="neutral" />
        <ArrowRight className="text-[#159052] w-8 h-8" strokeWidth={2.5} />
        <StepCard icon={Zap} title="Leadership Excitement" state="positive" />

        {/* Row 2 - Connectors */}
        <ArrowUp className="text-[#159052] w-8 h-8" strokeWidth={2.5} />
        <div className="col-span-5"></div>
        <ArrowDown className="text-[#159052] w-8 h-8" strokeWidth={2.5} />

        {/* Row 3 */}
        <StepCard icon={RotateCcw} title="New Pilot" state="neutral" />
        <ArrowLeft className="text-[#C5696A] w-8 h-8" strokeWidth={2.5} />
        <StepCard icon={XOctagon} title="No Production" state="negative" />
        <ArrowLeft className="text-[#C5696A] w-8 h-8" strokeWidth={2.5} />
        <StepCard icon={AlertCircle} title="Workflow Issue" state="negative" />
        <ArrowLeft className="text-[#C5696A] w-8 h-8" strokeWidth={2.5} />
        <StepCard icon={Database} title="Data Issue" state="negative" />
      </div>

      {/* Mobile Vertical Flow */}
      <div className="md:hidden flex flex-col items-center gap-3">
        <StepCard icon={Lightbulb} title="Idea" state="neutral" />
        <ArrowDown className="text-[#159052] w-6 h-6" strokeWidth={2.5} />
        <StepCard icon={Rocket} title="Pilot" state="neutral" />
        <ArrowDown className="text-[#159052] w-6 h-6" strokeWidth={2.5} />
        <StepCard icon={MonitorPlay} title="Demo" state="neutral" />
        <ArrowDown className="text-[#159052] w-6 h-6" strokeWidth={2.5} />
        <StepCard icon={Zap} title="Leadership Excitement" state="positive" />
        <ArrowDown className="text-[#A30A0C] w-6 h-6" strokeWidth={2.5} />
        <StepCard icon={Database} title="Data Issue" state="negative" />
        <ArrowDown className="text-[#A30A0C] w-6 h-6" strokeWidth={2.5} />
        <StepCard icon={AlertCircle} title="Workflow Issue" state="negative" />
        <ArrowDown className="text-[#A30A0C] w-6 h-6" strokeWidth={2.5} />
        <StepCard icon={XOctagon} title="No Production" state="negative" />
        <ArrowDown className="text-[#A30A0C] w-6 h-6" strokeWidth={2.5} />
        <StepCard icon={RotateCcw} title="New Pilot" state="neutral" />
      </div>
      
      <div className="mt-16 bg-white border-2 border-[#DEE4E1] p-5 rounded-lg text-center max-w-3xl mx-auto shadow-sm">
        <p className="text-[#03481E] font-medium text-base">
          <strong className="text-[#0E2419]">Note:</strong> A successful AI pilot needs business ownership, clean data, user adoption, governance, and a clear ROI metric before scaling.
        </p>
      </div>
    </div>
  );
};

const StepCard = ({ icon: Icon, title, state }: { icon: any, title: string, state: 'neutral' | 'positive' | 'negative' }) => {
  let colors = "bg-white border-2 border-[#DEE4E1] text-[#0E2419]";
  let iconColor = "text-[#159052]";
  
  if (state === 'positive') {
    colors = "bg-[#ECF8E9] border-2 border-[#009B57] text-[#03481E]";
    iconColor = "text-[#009B57]";
  } else if (state === 'negative') {
    colors = "bg-[#F9E4E4] border-2 border-[#C5696A] text-[#7A0506]";
    iconColor = "text-[#A30A0C]";
  }

  return (
    <div className={`w-36 h-28 flex flex-col items-center justify-center p-3 rounded-lg shadow-sm text-center ${colors}`}>
      <Icon className={`w-8 h-8 mb-3 ${iconColor}`} />
      <span className="text-sm font-bold leading-snug">{title}</span>
    </div>
  );
};
