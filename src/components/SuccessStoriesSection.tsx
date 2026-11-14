import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const SuccessStoriesSection: React.FC = () => {
  const stories = [
    {
      founder: 'Marcus Vance',
      company: 'Krono Modular Chronograph',
      category: 'Fashion & Hardware',
      savedOrRaised: '$120,000 Saved from Bad Tooling',
      quote: 'We initially planned a mechanical automatic movement priced at $650. Through VENTUREX customer votes and feedback, 74% said they loved the modular titanium case but wanted a solar quartz movement under $299. We pivoted before ordering tooling, pre-sold 450 units, and sold out our batch in 48 hours.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      outcome: '450 Pre-orders ($134K pledged)',
    },
    {
      founder: 'Dr. Leila Hassein',
      company: 'NeuroGlow Ambient Light',
      category: 'Health & Lifestyle',
      savedOrRaised: '$45,000 Inventory Saved',
      quote: 'VENTUREX showed us that our original target audience (gym owners) had almost zero interest, whereas work-from-home remote engineers were placing conditional pre-orders in droves. That insight completely shaped our launch strategy.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      outcome: '610 Waitlist signups in 7 days',
    },
  ];

  return (
    <section className="py-20 bg-[#0A0E1A] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-2">
            PROVEN TRACK RECORD
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Founders Who Validated First
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            See how smart entrepreneurs tested market willingness to pay before writing checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0D1222] border border-slate-800 p-8 flex flex-col justify-between relative group hover:border-[#7262F4]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.founder}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-base font-bold text-white">{story.founder}</h4>
                      <p className="text-xs text-slate-400">{story.company} · {story.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                    {story.savedOrRaised}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-[#9B8DFC] font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#7262F4]" />
                  {story.outcome}
                </span>
                <span>Verified Case Study</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
