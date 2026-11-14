import React from 'react';
import { StartupIdea, UserProfile, VoteType } from '../types/index.ts';
import { calculateValidationStats } from '../utils/validationLogic.ts';
import { 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  Share2, 
  Bookmark, 
  Calendar, 
  DollarSign, 
  Target, 
  AlertCircle, 
  Sparkles, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

interface IdeaDetailModalProps {
  idea: StartupIdea;
  currentUser: UserProfile;
  onClose: () => void;
  onVote: (vote: VoteType) => void;
  onBookmark: () => void;
  onOpenWaitlist: () => void;
  onOpenPreorder: () => void;
  onOpenAIAnalysis: () => void;
  onAddComment: (content: string) => void;
  onUpvoteComment: (commentId: string) => void;
  onSubmitFeedback: (feedback: {
    rating: number;
    priceWillingness: number;
    mustHaveFeatures: string;
    concernsOrCritique: string;
  }) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  currentUser,
  onClose,
  onVote,
  onBookmark,
  onOpenWaitlist,
  onOpenPreorder,
  onOpenAIAnalysis,
  onAddComment,
  onUpvoteComment,
  onSubmitFeedback,
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'feedback' | 'comments'>('overview');
  const [newComment, setNewComment] = React.useState('');
  const [showFormulaModal, setShowFormulaModal] = React.useState(false);
  const [copiedShare, setCopiedShare] = React.useState(false);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = React.useState(5);
  const [feedbackPrice, setFeedbackPrice] = React.useState(idea.estimatedPrice);
  const [feedbackFeatures, setFeedbackFeatures] = React.useState('');
  const [feedbackCritique, setFeedbackCritique] = React.useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);

  const stats = calculateValidationStats(
    idea.positiveVotes,
    idea.negativeVotes,
    idea.maybeVotes,
    idea.waitlistCount,
    idea.preordersCount
  );

  const userVote = idea.userVotes[currentUser.id];
  const isBookmarked = currentUser.savedIdeaIds.includes(idea.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback({
      rating: feedbackRating,
      priceWillingness: Number(feedbackPrice) || idea.estimatedPrice,
      mustHaveFeatures: feedbackFeatures.trim(),
      concernsOrCritique: feedbackCritique.trim(),
    });
    setFeedbackSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#090D1A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090D1A]/95 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-white">{idea.category}</span>
            <span aria-hidden="true">·</span>
            <span>Est. Launch: {idea.launchDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
              title="Copy share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedShare ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors text-xs flex items-center gap-1.5 ${
                isBookmarked ? 'text-[#7262F4]' : 'text-slate-300 hover:text-white'
              }`}
              title="Wishlist"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#7262F4]' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-2"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          {/* Hero Banner with Product Image */}
          <div className="relative aspect-[16/8] sm:aspect-[16/7] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={idea.imageUrl}
              alt={idea.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090D1A] via-transparent to-transparent opacity-90" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {idea.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
                  {idea.tagline}
                </p>
              </div>

              {/* Status and Price Tag */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-lg bg-[#7262F4] text-white font-bold text-xs shadow-md">
                  Demand: {stats.demandScore}/100
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-emerald-400 font-bold text-xs border border-emerald-500/30 tabular-nums">
                  ${idea.estimatedPrice} Retail
                </span>
              </div>
            </div>
          </div>

          {/* Validation Metrics & Voting Action Hub */}
          <div className="rounded-2xl bg-[#0F1426] border border-slate-800 p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Live Customer Validation Scoreboard</h3>
                  <button
                    onClick={() => setShowFormulaModal(!showFormulaModal)}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="How is this calculated?"
                  >
                    <Info className="w-4 h-4 text-[#7262F4]" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Based on {stats.totalVotes} verified customer votes and {idea.preordersCount} conditional pre-order pledges.
                </p>
              </div>

              {/* Founder / AI Quick Trigger */}
              <button
                onClick={onOpenAIAnalysis}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9B8DFC] bg-[#7262F4]/15 hover:bg-[#7262F4]/25 border border-[#7262F4]/30 transition-all shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7262F4]" />
                View AI Strategic Analysis
              </button>
            </div>

            {/* Demand Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                <div className="text-[11px] text-slate-400">Demand Score</div>
                <div className="text-2xl font-bold text-[#9B8DFC] tabular-nums mt-0.5">
                  {stats.demandScore}<span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">{stats.validationStatus}</div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                <div className="text-[11px] text-slate-400">Would Buy Intent</div>
                <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
                  {stats.positivePercentage}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{idea.positiveVotes} of {stats.totalVotes} votes</div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                <div className="text-[11px] text-slate-400">Waitlist Backers</div>
                <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
                  {idea.waitlistCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Early access requested</div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                <div className="text-[11px] text-slate-400">Pre-Order Intent</div>
                <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-0.5">
                  ${idea.preordersVolume.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{idea.preordersCount} pledges</div>
              </div>
            </div>

            {/* Transparent Formula Explainer Accordion */}
            {showFormulaModal && (
              <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-[#7262F4]/30 text-xs text-slate-300 space-y-2 animate-in fade-in">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7262F4]" />
                  Transparent Demand Score Formula
                </div>
                <p className="leading-relaxed">
                  Demand Score (0-100) = <strong className="text-white">Sentiment Ratio (45%)</strong> + <strong className="text-white">Waitlist Milestone Traction (25%)</strong> + <strong className="text-white">Conditional Pre-Orders Volume (30%)</strong>.
                </p>
                <p className="text-slate-400">
                  Duplicate votes from the same user account are automatically barred. Pledges are stored with verified buyer emails and city locations to validate authentic regional demand.
                </p>
              </div>
            )}

            {/* Voting Buttons Hub */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-2.5">
                Cast Your Customer Vote:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => onVote('yes')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    userVote === 'yes'
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                      : 'bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-800/60'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>YES, I WOULD BUY THIS</span>
                  {userVote === 'yes' && <span className="text-[10px] font-normal">(Your Vote)</span>}
                </button>

                <button
                  onClick={() => onVote('maybe')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    userVote === 'maybe'
                      ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                      : 'bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>MAYBE / NEED MORE INFO</span>
                  {userVote === 'maybe' && <span className="text-[10px] font-normal">(Your Vote)</span>}
                </button>

                <button
                  onClick={() => onVote('no')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    userVote === 'no'
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                      : 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/60'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>NOT INTERESTED</span>
                  {userVote === 'no' && <span className="text-[10px] font-normal">(Your Vote)</span>}
                </button>
              </div>

              {/* Action Buttons: Join Waitlist & Conditional Pre-Order */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-slate-800/60">
                <button
                  onClick={onOpenPreorder}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#7262F4] to-[#5F4EEA] hover:brightness-110 shadow-lg shadow-[#7262F4]/20 flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Place Conditional Pre-Order (${idea.estimatedPrice})
                </button>

                <button
                  onClick={onOpenWaitlist}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-xs text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-[#7262F4]" />
                  Join VIP Waitlist
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation for Detailed Sections */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[#7262F4]/20 text-[#9B8DFC] border border-[#7262F4]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Concept Details
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'feedback'
                    ? 'bg-[#7262F4]/20 text-[#9B8DFC] border border-[#7262F4]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Customer Feedback Form ({idea.feedbacks.length})
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'comments'
                    ? 'bg-[#7262F4]/20 text-[#9B8DFC] border border-[#7262F4]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Community Discussion ({idea.comments.length})
              </button>
            </div>

            {/* Tab 1: Concept Details */}
            {activeTab === 'overview' && (
              <div className="pt-6 space-y-6">
                {/* Founder Info */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <img
                    src={idea.founder.avatar}
                    alt={idea.founder.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs text-[#9B8DFC] font-semibold">Founder & Creator</div>
                    <div className="text-base font-bold text-white">{idea.founder.name}</div>
                    <div className="text-xs text-slate-400">{idea.founder.bio}</div>
                  </div>
                </div>

                {/* Problem & Solution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      The Problem Being Solved
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {idea.problem}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Target Audience
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {idea.targetAudience}
                    </p>
                  </div>
                </div>

                {/* Detailed Explanation */}
                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Detailed Product Explanation & Specs
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {idea.detailedExplanation}
                  </p>
                </div>

                {/* Manufacturing & Unit Economics Specs */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#0C101D] border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500">Estimated Budget</span>
                    <div className="text-sm font-bold text-white tabular-nums mt-0.5">
                      ${idea.estimatedBudget.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Target Retail Price</span>
                    <div className="text-sm font-bold text-emerald-400 tabular-nums mt-0.5">
                      ${idea.estimatedPrice}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Expected Delivery</span>
                    <div className="text-sm font-bold text-white tabular-nums mt-0.5">
                      {idea.launchDate}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Feedback Form */}
            {activeTab === 'feedback' && (
              <div className="pt-6 space-y-6">
                {feedbackSubmitted ? (
                  <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-base font-bold text-white">Thank You for Your Validation Feedback!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Your price point recommendation and feature notes have been logged for the founder.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white">Share Product Feedback with the Founder</h4>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Concept Viability Rating (1 = Low, 5 = Must Have)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className={`w-9 h-9 rounded-lg font-bold text-xs transition-colors ${
                              feedbackRating >= star
                                ? 'bg-[#7262F4] text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {star}★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        What price would you actually be willing to pay? ($)
                      </label>
                      <input
                        type="number"
                        value={feedbackPrice}
                        onChange={(e) => setFeedbackPrice(Number(e.target.value))}
                        className="w-full sm:w-48 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs tabular-nums focus:outline-none focus:border-[#7262F4]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        What feature would convince you to pre-order?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Waterproof rating, wireless charging dock..."
                        value={feedbackFeatures}
                        onChange={(e) => setFeedbackFeatures(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Any concerns, doubts, or competitive alternatives?
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Share constructive critique to help the founder iterate..."
                        value={feedbackCritique}
                        onChange={(e) => setFeedbackCritique(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#7262F4] hover:bg-[#5F4EEA] text-white text-xs font-semibold transition-colors"
                    >
                      Submit Feedback to Founder
                    </button>
                  </form>
                )}

                {/* Existing Feedbacks list */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recent Customer Feedback ({idea.feedbacks.length})
                  </h5>
                  {idea.feedbacks.map((fb) => (
                    <div key={fb.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-white">{fb.userName}</span>
                        <span className="text-[#9B8DFC] font-semibold">Willing to pay: ${fb.priceWillingness}</span>
                      </div>
                      <div className="text-slate-300">
                        <strong>Must have:</strong> {fb.mustHaveFeatures}
                      </div>
                      {fb.concernsOrCritique && (
                        <div className="text-slate-400">
                          <strong>Critique:</strong> {fb.concernsOrCritique}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Community Comments */}
            {activeTab === 'comments' && (
              <div className="pt-6 space-y-6">
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question or leave public feedback for the founder..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#7262F4] hover:bg-[#5F4EEA] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post
                  </button>
                </form>

                <div className="space-y-3">
                  {idea.comments.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      No comments yet. Be the first to share suggestions!
                    </p>
                  ) : (
                    idea.comments.map((comment) => (
                      <div key={comment.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={comment.userAvatar}
                              alt={comment.userName}
                              className="w-5 h-5 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="font-bold text-white">{comment.userName}</span>
                            <span className="text-[10px] text-slate-500 uppercase">{comment.userRole}</span>
                          </div>

                          <button
                            onClick={() => onUpvoteComment(comment.id)}
                            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#9B8DFC] transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span className="tabular-nums">{comment.upvotes}</span>
                          </button>
                        </div>
                        <p className="text-slate-300 leading-relaxed pl-7">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
