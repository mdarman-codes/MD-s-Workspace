import React from 'react';
import { PartnershipProposal, StartupIdea, UserProfile } from '../types/index.ts';
import { 
  Handshake, 
  ShieldAlert, 
  Send, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight,
  PlusCircle,
  FileCheck,
  Building,
  UserCheck,
  X
} from 'lucide-react';

interface PartnershipHubProps {
  ideas: StartupIdea[];
  proposals: PartnershipProposal[];
  currentUser: UserProfile;
  onSubmitProposal: (proposal: Partial<PartnershipProposal>) => void;
}

export const PartnershipHub: React.FC<PartnershipHubProps> = ({
  ideas,
  proposals,
  currentUser,
  onSubmitProposal,
}) => {
  const [filterType, setFilterType] = React.useState<string>('All');
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);
  const [selectedProposal, setSelectedProposal] = React.useState<PartnershipProposal | null>(
    proposals[0] || null
  );

  // New proposal form state
  const [targetIdeaId, setTargetIdeaId] = React.useState(ideas[0]?.id || '');
  const [proposalType, setProposalType] = React.useState<PartnershipProposal['type']>('Angel Investment');
  const [amountProposed, setAmountProposed] = React.useState('$100,000 SAFE');
  const [equityPercentage, setEquityPercentage] = React.useState('5% Target');
  const [proposalMessage, setProposalMessage] = React.useState('');
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false);

  const filteredProposals = proposals.filter((p) => {
    if (filterType === 'All') return true;
    return p.type === filterType;
  });

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetIdea = ideas.find((i) => i.id === targetIdeaId) || ideas[0];
    if (!targetIdea) return;

    onSubmitProposal({
      ideaId: targetIdea.id,
      ideaName: targetIdea.name,
      founderId: targetIdea.founder.id,
      founderName: targetIdea.founder.name,
      investorId: currentUser.id,
      investorName: currentUser.name,
      investorEmail: currentUser.email,
      type: proposalType,
      amountProposed,
      equityPercentage,
      message: proposalMessage,
      status: 'under_review',
      documentName: `${targetIdea.name.replace(/\s+/g, '_')}_TermSheet_Proposal.pdf`,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
      setProposalMessage('');
    }, 1500);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-1">
            CAPITAL & STRATEGIC SYNDICATE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Partnership & Equity Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Connect validated founders with mentors, corporate distribution partners, and accredited angel investors under verified demand terms.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-lg shadow-[#7262F4]/25 transition-all shrink-0 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Submit Partnership Proposal
        </button>
      </div>

      {/* Mandatory Regulatory & Legal Compliance Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-300 mb-0.5">
            Institutional Regulatory & Equity Safeguard Notice
          </div>
          <p>
            VENTUREX does not automatically broker securities, issue shares, or execute equity transfers. Any discussions, term sheets, or equity arrangements initiated on this platform require independent legal counsel, formal due diligence, and regulatory compliance under applicable securities laws.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        {['All', 'Angel Investment', 'Mentorship', 'Distribution Partnership', 'Equity Collaboration'].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-[#7262F4] text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* Main Partnership Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Proposals List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Active Proposals & Discussions ({filteredProposals.length})
          </div>

          {filteredProposals.map((prop) => {
            const isSelected = selectedProposal?.id === prop.id;
            return (
              <div
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0D1224] border-[#7262F4] ring-1 ring-[#7262F4]/40 shadow-lg'
                    : 'bg-[#0A0E1A] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">{prop.ideaName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#7262F4]/20 text-[#9B8DFC] border border-[#7262F4]/30">
                    {prop.type}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span>From: <strong className="text-slate-300">{prop.investorName}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>To: <strong className="text-slate-300">{prop.founderName}</strong></span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {prop.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {prop.amountProposed || prop.equityPercentage || 'Strategic Terms'}
                  </span>
                  <span className="text-slate-500 font-mono">{prop.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Proposal Detail & Document Management View (7 cols) */}
        <div className="lg:col-span-7">
          {selectedProposal ? (
            <div className="p-6 rounded-2xl bg-[#0D1224] border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B8DFC]">
                    {selectedProposal.type} PROPOSAL
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {selectedProposal.ideaName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Submitted on {selectedProposal.createdAt} by {selectedProposal.investorName} ({selectedProposal.investorEmail})
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                  Status: Under Review
                </span>
              </div>

              {/* Proposed Deal Terms Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div>
                  <div className="text-slate-400">Proposed Structure / Capital</div>
                  <div className="text-base font-bold text-emerald-400 tabular-nums mt-0.5">
                    {selectedProposal.amountProposed || 'Mentorship / Advisory'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Target Equity / Consideration</div>
                  <div className="text-base font-bold text-white tabular-nums mt-0.5">
                    {selectedProposal.equityPercentage || 'Non-equity commercial agreement'}
                  </div>
                </div>
              </div>

              {/* Message from Partner / Investor */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Syndicate Memorandum & Objectives
                </h4>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedProposal.message}
                </div>
              </div>

              {/* Agreement Document Management */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#7262F4]" />
                  Agreement Document & Legal Framework
                </h4>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-800/40 flex items-center justify-center">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {selectedProposal.documentName || 'Term_Sheet_Framework.pdf'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Template SAFE / Advisory Note · 4 pages · Requires Counsel Review
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Agreement draft downloaded for legal due diligence review.')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    Download Draft
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Discussion Room Open</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert('Discussion message thread initiated with partner.')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
                  >
                    Message Partner
                  </button>
                  <button
                    onClick={() => alert('Term sheet acknowledged and flagged for legal schedule.')}
                    className="px-4 py-2 rounded-xl bg-[#7262F4] hover:bg-[#5F4EEA] text-white font-semibold transition-colors"
                  >
                    Accept for Formal Review
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-[#0D1224] border border-slate-800 text-center text-xs text-slate-500">
              Select a proposal from the left to inspect terms and documents.
            </div>
          )}
        </div>
      </div>

      {/* Submit Proposal Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="relative w-full max-w-lg bg-[#0D1222] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {submittedSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Proposal Submitted!</h3>
                <p className="text-xs text-slate-300">
                  Your strategic proposal has been transmitted to the founder for review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateProposal} className="space-y-4 text-xs">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9B8DFC]">
                    NEW PARTNERSHIP SUBMISSION
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Propose Partnership or Investment
                  </h3>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Select Target Startup Campaign
                  </label>
                  <select
                    value={targetIdeaId}
                    onChange={(e) => setTargetIdeaId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                  >
                    {ideas.map((idea) => (
                      <option key={idea.id} value={idea.id}>
                        {idea.name} (Founder: {idea.founder.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Partnership Type
                  </label>
                  <select
                    value={proposalType}
                    onChange={(e) => setProposalType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                  >
                    <option value="Angel Investment">Angel Investment / Seed SAFE</option>
                    <option value="Mentorship">Advisory & Mentorship</option>
                    <option value="Distribution Partnership">Retail / Global Distribution Partnership</option>
                    <option value="Equity Collaboration">Equity Collaboration / Joint Venture</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Capital / Resource Scope
                    </label>
                    <input
                      type="text"
                      placeholder="$100,000 or Advisory"
                      value={amountProposed}
                      onChange={(e) => setAmountProposed(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Target Equity %
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5% or 1-2% Advisory"
                      value={equityPercentage}
                      onChange={(e) => setEquityPercentage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Proposal Terms & Value-Add Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how your syndicate or firm will accelerate this validated startup..."
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-lg shadow-[#7262F4]/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Transmit Strategic Proposal
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
