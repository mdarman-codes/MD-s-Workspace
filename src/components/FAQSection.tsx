import React from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  const faqs = [
    {
      q: 'How does a conditional pre-order work on VENTUREX?',
      a: 'A conditional pre-order is an expression of purchase intent under clear, transparent terms. When a customer pledges, their card is not charged upfront. Instead, funds are only authorized through an escrow gateway if and when the founder reaches their required validation threshold and confirms guaranteed manufacturing timelines. Customers can cancel anytime before production lock-in.',
    },
    {
      q: 'Is my intellectual property (IP) and startup concept protected?',
      a: 'Founders retain 100% ownership of their ideas, trademarks, and design files. You control what technical details are public versus private. For proprietary patents or hardware schematics, you can share high-level benefits on the public card and require verified investor NDAs in the Partnership Hub.',
    },
    {
      q: 'How is the Demand Score and Customer Interest percentage calculated?',
      a: 'VENTUREX uses a multi-factor transparent formula: Sentiment Ratio accounts for 45% (positive vs negative/maybe votes), Waitlist Traction accounts for 25% (normalized against benchmark milestones), and Conditional Pre-Orders account for 30% (hard purchase intent). We prevent bot voting by authenticating voters and deduplicating accounts.',
    },
    {
      q: 'How accurate is the AI Startup Analysis?',
      a: 'The AI Startup Analysis is powered by Gemini 3.8 Flash, trained on venture frameworks, unit economics, and consumer market comps. It produces an estimated Startup Readiness Score (0-100), full SWOT matrix, and customer persona risks. As indicated on every report, these scores are strategic estimates and tools for refinement, not guaranteed promises of commercial success.',
    },
    {
      q: 'Can investors and mentors invest directly in startups on VENTUREX?',
      a: 'Through our Partnership & Equity Hub, accredited investors, syndicates, and mentors can review high-demand campaigns, submit term-sheet proposals, and request discussions. Note that VENTUREX does not automatically transfer equity or securities; all final contracts require independent legal documentation and regulatory compliance.',
    },
  ];

  return (
    <section className="py-20 bg-[#0A0E1A] border-b border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-2">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Clear answers on validation mechanics, voter integrity, and capital safety.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0D1222] border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-[#9B8DFC] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-[#7262F4]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
