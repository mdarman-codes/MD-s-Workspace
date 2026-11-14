import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export const PricingSection: React.FC<{ onSelectPlan: (plan: string) => void }> = ({ onSelectPlan }) => {
  const plans = [
    {
      name: 'Explorer & Voter',
      price: '$0',
      period: 'Forever free',
      description: 'For curious consumers, early adopters, and founders testing their very first concept.',
      features: [
        'Discover all trending startup ideas',
        'Vote on products and influence designs',
        'Place conditional pre-orders with zero upfront charge',
        '1 basic startup idea submission',
        'Community discussion access',
      ],
      popular: false,
      cta: 'Get Started Free',
    },
    {
      name: 'Founder Launch',
      price: '$49',
      period: 'per validation campaign',
      description: 'Everything you need to definitively validate real customer willingness to pay.',
      features: [
        'Unlimited idea submissions & updates',
        'Institutional AI Startup Analysis & SWOT Report',
        'Startup Readiness Score (0-100)',
        'Full Customer Feedback & price elasticity charts',
        'Conditional Pre-Order Collection System',
        'Export verified backer emails & city breakdown',
        'Direct backer messaging portal',
      ],
      popular: true,
      cta: 'Launch Campaign',
    },
    {
      name: 'Syndicate & Scale',
      price: '$149',
      period: 'per campaign',
      description: 'For high-conviction hardware and consumer brands ready for investor term sheets.',
      features: [
        'Everything in Founder Launch',
        'Featured placement on VENTUREX Homepage',
        'Dedicated Partnership & Investor introductions',
        'Custom 5-question customer validation survey',
        'Verified Startup Demand Badge',
        'Priority moderation review (under 6 hours)',
        'Dedicated validation strategist review call',
      ],
      popular: false,
      cta: 'Scale With Syndicate',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#080B14] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-2">
            TRANSPARENT PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Invest in Validation, Not Failed Inventory
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Save $20,000 to $100,000 in upfront tooling and production mistakes with a single validation cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-[#0E1428] border-2 border-[#7262F4] shadow-2xl shadow-[#7262F4]/20'
                  : 'bg-[#0D1222] border border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7262F4] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6 min-h-[36px]">{plan.description}</p>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-white tabular-nums">{plan.price}</span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>

                <div className="w-full h-px bg-slate-800 my-6" />

                <div className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#7262F4] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full py-3 rounded-xl font-semibold text-xs transition-all ${
                  plan.popular
                    ? 'bg-[#7262F4] hover:bg-[#5F4EEA] text-white shadow-lg shadow-[#7262F4]/30'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
