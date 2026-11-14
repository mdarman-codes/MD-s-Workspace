import React from 'react';
import { StartupIdea, AIStartupAnalysis } from '../types/index.ts';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Copy, 
  Check, 
  AlertTriangle,
  HelpCircle,
  Award
} from 'lucide-react';

interface AIAnalysisModalProps {
  idea: StartupIdea;
  analysis: AIStartupAnalysis;
  onClose: () => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  idea,
  analysis,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySummary = () => {
    const summary = `VENTUREX AI Startup Readiness Report: ${idea.name}
Readiness Score: ${analysis.readinessScore}/100
Market Opportunity: ${analysis.marketOpportunity}
Target Customer: ${analysis.targetCustomer}
Competitor Analysis: ${analysis.competitorAnalysis}
Pricing Recommendation: ${analysis.pricingSuggestion}
Disclaimer: ${analysis.disclaimer}`;
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (score >= 60) return 'text-[#9B8DFC] border-[#7262F4]/40 bg-[#7262F4]/15';
    return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#090D1A] border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090D1A]/95 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7262F4]/20 border border-[#7262F4]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#7262F4]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                AI Strategic Startup Analysis
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Gemini 3.8 Flash Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">{idea.name} · {idea.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Top Score Banner & Official Disclaimer */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-5 rounded-2xl bg-[#0D1224] border border-slate-800">
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-slate-800/80 bg-slate-900/60">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Startup Readiness Score
              </div>
              <div className={`text-5xl font-extrabold tabular-nums px-4 py-2 rounded-2xl border ${getScoreColor(analysis.readinessScore)}`}>
                {analysis.readinessScore}
                <span className="text-lg text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-2">
                {analysis.readinessScore >= 80 ? 'High Validation Velocity' : 'Iterative Concept Stage'}
              </div>
            </div>

            <div className="md:col-span-8 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#7262F4]" />
                Institutional Positioning Summary
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.productPositioning}
              </p>
              
              {/* Mandatory AI Disclaimer Badge */}
              <div className="pt-2 flex items-start gap-2 text-[11px] text-amber-300/80 bg-amber-950/20 p-2.5 rounded-lg border border-amber-800/30">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Advisory Disclaimer:</strong> {analysis.disclaimer}
                </span>
              </div>
            </div>
          </div>

          {/* Market Opportunity & Target Customer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-bold text-[#9B8DFC] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Market Opportunity Analysis
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.marketOpportunity}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Target Customer Persona
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.targetCustomer}
              </p>
            </div>
          </div>

          {/* Competitor Analysis & Pricing Elasticity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#7262F4]" />
                Competitor Research & Differentiation
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.competitorAnalysis}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                Pricing Suggestions & Margin Model
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.pricingSuggestion}
              </p>
            </div>
          </div>

          {/* 4-Quadrant SWOT Matrix */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>SWOT Strategic Matrix</span>
              <span className="text-slate-500 font-normal">· Strengths, Weaknesses, Opportunities, Threats</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
                <div className="text-xs font-bold text-emerald-400 mb-2">Strengths (Internal)</div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.swot.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30">
                <div className="text-xs font-bold text-amber-400 mb-2">Weaknesses (Internal)</div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.swot.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">⚠</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30">
                <div className="text-xs font-bold text-indigo-400 mb-2">Opportunities (External)</div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.swot.opportunities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400">★</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/30">
                <div className="text-xs font-bold text-rose-400 mb-2">Threats (External)</div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.swot.threats.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Potential Risks & Improvement Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-rose-950/15 border border-rose-900/30">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Key Execution & Regulatory Risks
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.potentialRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#7262F4]/10 border border-[#7262F4]/30">
              <div className="text-xs font-bold text-[#9B8DFC] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Improvement Recommendations
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#7262F4] font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customer Validation Questionnaire */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#7262F4]" />
              5-Question Customer Validation Survey Template
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Use these survey questions in user interviews or embed them into your waitlist confirmation flow:
            </p>
            <div className="space-y-2">
              {analysis.validationQuestions.map((q, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <span className="font-mono text-[#7262F4] font-bold">Q{idx + 1}.</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
