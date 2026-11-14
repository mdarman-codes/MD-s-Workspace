import React from 'react';
import { StartupIdea, UserProfile } from '../types/index.ts';
import { calculateValidationStats } from '../utils/validationLogic.ts';
import { 
  BarChart3, 
  Users, 
  ThumbsUp, 
  DollarSign, 
  PlusCircle, 
  Sparkles, 
  Eye, 
  Download, 
  TrendingUp, 
  MessageSquare,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FounderDashboardProps {
  ideas: StartupIdea[];
  currentUser: UserProfile;
  onOpenSubmitModal: () => void;
  onSelectIdea: (idea: StartupIdea) => void;
  onOpenAIAnalysis: (idea: StartupIdea) => void;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  ideas,
  currentUser,
  onOpenSubmitModal,
  onSelectIdea,
  onOpenAIAnalysis,
}) => {
  // Filter ideas submitted by or assigned to this founder, or show all if none submitted yet
  const founderIdeas = ideas.filter((idea) => idea.founder.id === currentUser.id);
  const displayIdeas = founderIdeas.length > 0 ? founderIdeas : ideas.slice(0, 2);
  const activeIdea = displayIdeas[0];

  const [selectedIdeaId, setSelectedIdeaId] = React.useState<string>(activeIdea ? activeIdea.id : ideas[0]?.id);
  const currentIdea = ideas.find((i) => i.id === selectedIdeaId) || ideas[0];

  // Aggregate metrics
  const totalVotesAcross = displayIdeas.reduce(
    (acc, cur) => acc + cur.positiveVotes + cur.negativeVotes + cur.maybeVotes,
    0
  );
  const totalPositiveAcross = displayIdeas.reduce((acc, cur) => acc + cur.positiveVotes, 0);
  const totalWaitlistAcross = displayIdeas.reduce((acc, cur) => acc + cur.waitlistCount, 0);
  const totalPreordersVolume = displayIdeas.reduce((acc, cur) => acc + cur.preordersVolume, 0);

  const stats = currentIdea
    ? calculateValidationStats(
        currentIdea.positiveVotes,
        currentIdea.negativeVotes,
        currentIdea.maybeVotes,
        currentIdea.waitlistCount,
        currentIdea.preordersCount
      )
    : null;

  const handleExportWaitlist = () => {
    if (!currentIdea) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Name,Email,Date\n' +
      currentIdea.waitlist.map((w) => `"${w.name}","${w.email}","${w.createdAt}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentIdea.name.replace(/\s+/g, '_')}_Waitlist.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-1">
            FOUNDER VALIDATION COMMAND CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Founder Studio & Demand Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor real-time customer purchase intent, backer feedback, and conditional pre-order volumes.
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-lg shadow-[#7262F4]/25 transition-all self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Submit New Startup Idea
        </button>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Customer Votes</span>
            <ThumbsUp className="w-4 h-4 text-[#7262F4]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {totalVotesAcross.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {totalVotesAcross > 0 ? Math.round((totalPositiveAcross / totalVotesAcross) * 100) : 0}% Positive Intent
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Waitlist Registrations</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {totalWaitlistAcross.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified potential buyers</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Conditional Pre-Orders</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
            ${totalPreordersVolume.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pledged capital intent</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Validation Status</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#9B8DFC] truncate">
            {stats ? stats.validationStatus : 'Active'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Institutional rating</div>
        </div>
      </div>

      {/* Idea Selector (if founder has multiple campaigns) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">Active Campaign:</span>
        {ideas.map((idea) => (
          <button
            key={idea.id}
            onClick={() => setSelectedIdeaId(idea.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedIdeaId === idea.id
                ? 'bg-[#7262F4] text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            {idea.name}
          </button>
        ))}
      </div>

      {currentIdea && stats && (
        <div className="space-y-8">
          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Customer Interest Over Time SVG Chart */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#7262F4]" />
                      Customer Interest Velocity Over Time
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Daily vote accumulation and positive sentiment tracking.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7262F4]" />
                      Votes
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      % Positive
                    </span>
                  </div>
                </div>

                {/* SVG Visual Area Chart */}
                <div className="h-56 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7262F4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#7262F4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#1E293B" strokeDasharray="3 3" />
                    <line x1="0" y1="130" x2="500" y2="130" stroke="#1E293B" strokeDasharray="3 3" />

                    {/* Area fill */}
                    <polygon
                      points="20,130 110,110 230,80 350,45 470,20 470,140 20,140"
                      fill="url(#purpleGrad)"
                    />

                    {/* Votes curve */}
                    <polyline
                      fill="none"
                      stroke="#7262F4"
                      strokeWidth="3"
                      points="20,130 110,110 230,80 350,45 470,20"
                    />

                    {/* Positive sentiment dashed line */}
                    <polyline
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      points="20,50 110,48 230,44 350,40 470,38"
                    />

                    {/* Data Points */}
                    {[
                      { x: 20, y: 130, val: '45 votes' },
                      { x: 110, y: 110, val: '110 votes' },
                      { x: 230, y: 80, val: '195 votes' },
                      { x: 350, y: 45, val: '290 votes' },
                      { x: 470, y: 20, val: `${currentIdea.positiveVotes} votes` },
                    ].map((pt, idx) => (
                      <g key={idx}>
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#080B14" stroke="#7262F4" strokeWidth="2.5" />
                      </g>
                    ))}
                  </svg>

                  {/* Horizontal timeline axis labels */}
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                    <span>Day 1 (Launch)</span>
                    <span>Day 3</span>
                    <span>Day 6</span>
                    <span>Day 9</span>
                    <span>Today (Live)</span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-4">
                <span>Validation Sample: {stats.totalVotes} responses</span>
                <button
                  onClick={() => onSelectIdea(currentIdea)}
                  className="text-[#9B8DFC] hover:text-white font-semibold flex items-center gap-1 transition-colors"
                >
                  View Public Validation Page
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Voting Sentiment Breakdown & AI Readiness Badge */}
            <div className="lg:col-span-4 space-y-6">
              {/* Sentiment Breakdown */}
              <div className="p-6 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Sentiment Breakdown</span>
                  <span className="text-xs text-[#9B8DFC] font-bold tabular-nums">
                    {stats.demandScore}/100 Score
                  </span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>YES, WOULD BUY</span>
                      <span className="font-bold text-emerald-400 tabular-nums">
                        {stats.positivePercentage}% ({currentIdea.positiveVotes})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${stats.positivePercentage}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>MAYBE / NEED INFO</span>
                      <span className="font-bold text-amber-400 tabular-nums">
                        {stats.maybePercentage}% ({currentIdea.maybeVotes})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${stats.maybePercentage}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>NOT INTERESTED</span>
                      <span className="font-bold text-rose-400 tabular-nums">
                        {stats.negativePercentage}% ({currentIdea.negativeVotes})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${stats.negativePercentage}%` }} />
                    </div>
                  </div>
                </div>

                {/* AI Analysis Quick Launcher */}
                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onOpenAIAnalysis(currentIdea)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-[#7262F4]/20 hover:bg-[#7262F4]/30 border border-[#7262F4]/40 flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#7262F4]" />
                    Inspect AI SWOT & Readiness Report
                  </button>
                </div>
              </div>

              {/* Manufacturing Capital Breakeven */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-white">Target Breakeven Progress</div>
                <div className="flex justify-between text-slate-400">
                  <span>Pledged Pre-Orders:</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    ${currentIdea.preordersVolume.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tooling Budget Goal:</span>
                  <span className="text-white font-bold tabular-nums">
                    ${currentIdea.estimatedBudget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-1">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (currentIdea.preordersVolume / currentIdea.estimatedBudget) * 100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Threshold: When pre-orders reach 75% of budget, supplier tooling contract can be securely authorized.
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Pre-Orders Ledger & Waitlist Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conditional Pre-orders Ledger */}
            <div className="p-6 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Conditional Pre-Orders Ledger ({currentIdea.preorders.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified customer purchase commitments.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md tabular-nums">
                  ${currentIdea.preordersVolume.toLocaleString()} Total
                </span>
              </div>

              {currentIdea.preorders.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No conditional pre-orders logged yet. Share your campaign link to collect pledges!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="pb-2">Backer Name</th>
                        <th className="pb-2">Location</th>
                        <th className="pb-2">Qty</th>
                        <th className="pb-2 text-right">Commitment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {currentIdea.preorders.map((po) => (
                        <tr key={po.id} className="text-slate-300">
                          <td className="py-2.5 font-medium text-white truncate max-w-[140px]">
                            {po.customerName}
                          </td>
                          <td className="py-2.5 text-slate-400 truncate max-w-[120px]">
                            {po.city}, {po.country}
                          </td>
                          <td className="py-2.5 tabular-nums">{po.quantity}x</td>
                          <td className="py-2.5 text-right font-bold text-emerald-400 tabular-nums">
                            ${po.totalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Waitlist Management */}
            <div className="p-6 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Waitlist Leads & Subscribers ({currentIdea.waitlist.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customers who requested early batch invites.
                  </p>
                </div>

                <button
                  onClick={handleExportWaitlist}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>

              {currentIdea.waitlist.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No waitlist subscribers yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2 text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {currentIdea.waitlist.map((w) => (
                        <tr key={w.id} className="text-slate-300">
                          <td className="py-2.5 font-medium text-white">{w.name}</td>
                          <td className="py-2.5 text-slate-400 truncate max-w-[180px]">{w.email}</td>
                          <td className="py-2.5 text-right text-slate-500 text-[11px] font-mono">{w.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
