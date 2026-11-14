import React from 'react';
import { StartupIdea, IdeaCategory, UserProfile } from '../types/index.ts';
import { calculateValidationStats } from '../utils/validationLogic.ts';
import { 
  Search, 
  Flame, 
  Clock, 
  ThumbsUp, 
  Award, 
  Bookmark, 
  ArrowUpRight,
  Filter,
  CheckCircle2,
  TrendingUp,
  Tag
} from 'lucide-react';

interface MarketplaceViewProps {
  ideas: StartupIdea[];
  currentUser: UserProfile;
  onSelectIdea: (idea: StartupIdea) => void;
  onToggleBookmark: (ideaId: string) => void;
  onQuickVote: (ideaId: string, vote: 'yes' | 'no' | 'maybe') => void;
}

const CATEGORIES: ('All' | IdeaCategory)[] = [
  'All',
  'Technology',
  'Health & Fitness',
  'Food & Beverages',
  'Lifestyle',
  'Fashion & Clothing',
  'Beauty & Skincare',
  'Mobile Applications',
  'Education',
  'Other',
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  ideas,
  currentUser,
  onSelectIdea,
  onToggleBookmark,
  onQuickVote,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<'All' | IdeaCategory>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'trending' | 'recent' | 'votes' | 'recommended'>('trending');

  // Filter ideas
  const filteredIdeas = React.useMemo(() => {
    return ideas.filter((idea) => {
      const matchesCategory = selectedCategory === 'All' || idea.category === selectedCategory;
      const matchesSearch =
        idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.founder.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [ideas, selectedCategory, searchQuery]);

  // Sort ideas
  const sortedIdeas = React.useMemo(() => {
    const list = [...filteredIdeas];
    if (sortBy === 'recent') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (sortBy === 'votes') {
      return list.sort((a, b) => (b.positiveVotes + b.negativeVotes) - (a.positiveVotes + a.negativeVotes));
    }
    if (sortBy === 'recommended') {
      return list.sort((a, b) => {
        const statsA = calculateValidationStats(a.positiveVotes, a.negativeVotes, a.maybeVotes, a.waitlistCount, a.preordersCount);
        const statsB = calculateValidationStats(b.positiveVotes, b.negativeVotes, b.maybeVotes, b.waitlistCount, b.preordersCount);
        return statsB.demandScore - statsA.demandScore;
      });
    }
    // Default trending: combination of votes and recency
    return list.sort((a, b) => {
      const scoreA = a.positiveVotes * 2 + a.waitlistCount;
      const scoreB = b.positiveVotes * 2 + b.waitlistCount;
      return scoreB - scoreA;
    });
  }, [filteredIdeas, sortBy]);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Tagline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-1">
            DISCOVERY MARKETPLACE
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Explore Startup Ideas in Validation
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Vote on products you would actually buy, join exclusive pre-launch waitlists, and shape the next generation of products.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ideas, founders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4] transition-colors"
          />
        </div>
      </div>

      {/* Categories & Sorting Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
        {/* Category Scrollable Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#7262F4] text-white shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0 text-xs">
          <button
            onClick={() => setSortBy('trending')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              sortBy === 'trending' ? 'bg-[#7262F4]/20 text-[#9B8DFC] font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Trending
          </button>
          <button
            onClick={() => setSortBy('votes')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              sortBy === 'votes' ? 'bg-[#7262F4]/20 text-[#9B8DFC] font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            Most Voted
          </button>
          <button
            onClick={() => setSortBy('recommended')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              sortBy === 'recommended' ? 'bg-[#7262F4]/20 text-[#9B8DFC] font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Highest Demand
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              sortBy === 'recent' ? 'bg-[#7262F4]/20 text-[#9B8DFC] font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recent
          </button>
        </div>
      </div>

      {/* Ideas Grid */}
      {sortedIdeas.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-800 bg-[#0A0E1A]">
          <p className="text-base text-slate-300 font-semibold mb-1">No startup ideas found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search terms or select another category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs rounded-lg font-semibold bg-[#7262F4] text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIdeas.map((idea) => {
            const stats = calculateValidationStats(
              idea.positiveVotes,
              idea.negativeVotes,
              idea.maybeVotes,
              idea.waitlistCount,
              idea.preordersCount
            );
            const isBookmarked = currentUser.savedIdeaIds.includes(idea.id);
            const userVote = idea.userVotes[currentUser.id];

            return (
              <div
                key={idea.id}
                className="group rounded-2xl bg-[#0D1222] border border-slate-800/90 hover:border-[#7262F4]/50 transition-all flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#7262F4]/10 cursor-pointer"
                onClick={() => onSelectIdea(idea)}
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={idea.imageUrl}
                      alt={idea.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1222] via-transparent to-transparent opacity-80" />

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(idea.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-colors"
                      title={isBookmarked ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isBookmarked ? 'text-[#7262F4] fill-[#7262F4]' : ''
                        }`}
                      />
                    </button>

                    {/* Category Label without pill enclosure */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-slate-200 bg-[#080B14]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      <span>{idea.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#9B8DFC] font-semibold tabular-nums">${idea.estimatedPrice}</span>
                    </div>

                    {/* Demand Score badge */}
                    <div className="absolute top-3 left-3 bg-[#7262F4] text-white px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md">
                      Demand Score: {stats.demandScore}/100
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                      <img
                        src={idea.founder.avatar}
                        alt={idea.founder.name}
                        className="w-5 h-5 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-slate-300 font-medium truncate">{idea.founder.name}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-semibold">{stats.validationStatus}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#9B8DFC] transition-colors line-clamp-1 mb-1.5">
                      {idea.name}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {idea.shortDescription}
                    </p>

                    {/* Demand Meter Progress Bar */}
                    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 mb-3">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-400">Would Buy Intent</span>
                        <span className="text-white font-bold tabular-nums">
                          {stats.positivePercentage}% ({idea.positiveVotes} of {stats.totalVotes})
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7262F4] to-[#A78BFA]"
                          style={{ width: `${stats.positivePercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
                        <span className="tabular-nums">{idea.waitlistCount} on waitlist</span>
                        <span className="tabular-nums text-emerald-400 font-semibold">
                          ${idea.preordersVolume.toLocaleString()} pre-orders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Strip */}
                <div 
                  className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onQuickVote(idea.id, 'yes')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        userVote === 'yes'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title="Vote: I would buy this"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Buy
                    </button>
                    <button
                      onClick={() => onQuickVote(idea.id, 'maybe')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        userVote === 'maybe'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title="Vote: Maybe / Need more info"
                    >
                      Maybe
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectIdea(idea)}
                    className="text-xs font-semibold text-[#9B8DFC] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    View Details
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
