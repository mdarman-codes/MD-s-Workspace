import React from 'react';
import { 
  Rocket, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  CreditCard,
  BarChart3,
  ThumbsUp
} from 'lucide-react';

interface HeroSectionProps {
  onValidateClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onValidateClick,
  onExploreClick,
}) => {
  const [demoVotes, setDemoVotes] = React.useState(342);
  const [hasVotedDemo, setHasVotedDemo] = React.useState(false);

  const handleDemoVote = () => {
    if (!hasVotedDemo) {
      setDemoVotes((prev) => prev + 1);
      setHasVotedDemo(true);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-800/60">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#7262F4]/12 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline text kicker without pill borders */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-4">
              <span>VENTUREX VALIDATION PROTOCOL</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Validate Before You Launch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6 max-w-2xl" style={{ textWrap: 'balance' }}>
              Your Next Big Idea Deserves to Be Tested.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-xl">
              Validate your business idea with real customers before investing your money in manufacturing, marketing, or development.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={onValidateClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-lg shadow-[#7262F4]/30 hover:shadow-[#7262F4]/50 transition-all flex items-center justify-center gap-2 text-base group"
              >
                Validate Your Idea
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2 text-base"
              >
                Explore Startups
              </button>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 w-full max-w-lg">
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">84%</div>
                <div className="text-xs text-slate-400 mt-0.5">Average capital saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">48h</div>
                <div className="text-xs text-slate-400 mt-0.5">Customer signal time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">$3.8M+</div>
                <div className="text-xs text-slate-400 mt-0.5">Conditional pre-orders</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Hero Artwork & Interactive Live Validation Widget */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0C101D] shadow-2xl group">
              {/* Image banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/venturex_hero_concept_1794500950973.jpg"
                  alt="Futuristic modular smart hardware prototype"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C101D] via-black/40 to-transparent" />
                
                {/* Live simulation badge */}
                <div className="absolute top-3 left-3 bg-[#080B14]/80 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono font-medium text-slate-300 border border-white/10">
                  LIVE DEMO PREVIEW
                </div>

                <div className="absolute top-3 right-3 bg-[#7262F4]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white">
                  Demand: 88%
                </div>
              </div>

              {/* Interactive Validation Card Body */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#9B8DFC]">Hardware & IoT</span>
                  <span className="text-xs text-slate-400">Target: $249</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Aura Modular Desktop Synthesizer
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  Screenless modular acoustic hub designed for creators with real-time biometric haptic sync.
                </p>

                {/* Demand Meter */}
                <div className="mb-4 bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-[#7262F4]" />
                      Customer Purchase Intent
                    </span>
                    <span className="text-white font-bold tabular-nums">88% (High Demand)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#7262F4] to-[#A78BFA] transition-all duration-500" 
                      style={{ width: '88%' }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                    <span className="tabular-nums">{demoVotes} Verified Voters</span>
                    <span className="tabular-nums">88 Conditional Pre-Orders</span>
                  </div>
                </div>

                {/* Interactive Demo Action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDemoVote}
                    disabled={hasVotedDemo}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      hasVotedDemo
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#7262F4] hover:bg-[#5F4EEA] text-white shadow-md shadow-[#7262F4]/20'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {hasVotedDemo ? 'Vote Logged (YES I WOULD BUY)' : 'Test Vote: YES I WOULD BUY'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
