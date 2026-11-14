import React from 'react';
import { Target, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC<{ onStartClick: () => void }> = ({ onStartClick }) => {
  const steps = [
    {
      number: '01',
      title: 'Submit Your Concept & Run AI Audit',
      description: 'Upload your concept specs, pricing, and visual mockups. Our institutional AI engine instantly stress-tests your market positioning, unit economics, and customer persona risks.',
      icon: Target,
    },
    {
      number: '02',
      title: 'Collect Verified Customer Votes & Pre-Orders',
      description: 'Real early adopters vote whether they would purchase, submit structured price-elasticity feedback, join waitlists, or place conditional pre-orders with zero upfront credit card charge.',
      icon: Users,
    },
    {
      number: '03',
      title: 'Launch With Proven Demand or Pivot Early',
      description: 'Analyze transparent demand scores and pre-order volumes. Enter manufacturing with guaranteed customers, or pivot before wasting tens of thousands of dollars on dead inventory.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-20 bg-[#080B14] border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-2">
            THE VALIDATION METHODOLOGY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How VENTUREX De-Risks Your Startup
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Never build in the dark. Replace guesswork with hard purchase intent from actual customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl bg-[#0D1222] border border-slate-800/80 p-8 hover:border-[#7262F4]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-mono font-bold text-slate-600">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#7262F4]/10 border border-[#7262F4]/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#7262F4]" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-medium text-[#9B8DFC]">
                  <span>Validation Protocol Active</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">100% Risk Free</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={onStartClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-lg shadow-[#7262F4]/25 transition-all"
          >
            Start Your Validation Campaign
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
