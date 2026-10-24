import React from 'react';
import { AiRoiGap, HiddenCost, PilotPurgatory, ToolOverload, DecisionIntelligenceSystem } from '@aibyters/charts-infographics';

export default function InfographicsShowcasePage() {
  return (
    <div className="p-0 sm:p-4 lg:p-8 space-y-16 max-w-6xl mx-auto [overflow-wrap:anywhere]">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Infographics Showcase</h1>
        <p className="text-gray-400">A collection of premium AI/Data story infographics.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-800 pb-2">AI ROI Gap</h2>
        <div className="bg-neutral-900 rounded-xl p-3 sm:p-6 lg:p-8 border border-neutral-800">
          <AiRoiGap />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-800 pb-2">The Hidden Costs of AI</h2>
        <div className="bg-neutral-900 rounded-xl p-3 sm:p-6 lg:p-8 border border-neutral-800">
          <HiddenCost />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-800 pb-2">Pilot Purgatory</h2>
        <div className="bg-neutral-900 rounded-xl p-3 sm:p-6 lg:p-8 border border-neutral-800">
          <PilotPurgatory />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-800 pb-2">Tool Overload</h2>
        <div className="bg-neutral-900 rounded-xl p-3 sm:p-6 lg:p-8 border border-neutral-800">
          <ToolOverload />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-800 pb-2">Decision Intelligence System</h2>
        <div className="bg-neutral-900 rounded-xl p-3 sm:p-6 lg:p-8 border border-neutral-800">
          <DecisionIntelligenceSystem />
        </div>
      </section>
    </div>
  );
}
