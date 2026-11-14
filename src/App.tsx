import React from 'react';
import { 
  StartupIdea, 
  UserProfile, 
  UserRole, 
  VoteType, 
  PartnershipProposal 
} from './types/index.ts';
import { 
  INITIAL_IDEAS, 
  INITIAL_USERS, 
  INITIAL_PARTNERSHIP_PROPOSALS 
} from './data/mockStartups.ts';
import { applyUserVote } from './utils/validationLogic.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { HowItWorksSection } from './components/HowItWorksSection.tsx';
import { SuccessStoriesSection } from './components/SuccessStoriesSection.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { FAQSection } from './components/FAQSection.tsx';
import { Footer } from './components/Footer.tsx';
import { MarketplaceView } from './components/MarketplaceView.tsx';
import { IdeaDetailModal } from './components/IdeaDetailModal.tsx';
import { PreorderModal } from './components/PreorderModal.tsx';
import { WaitlistModal } from './components/WaitlistModal.tsx';
import { SubmitIdeaModal } from './components/SubmitIdeaModal.tsx';
import { AIAnalysisModal } from './components/AIAnalysisModal.tsx';
import { FounderDashboard } from './components/FounderDashboard.tsx';
import { PartnershipHub } from './components/PartnershipHub.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';

export default function App() {
  const [ideas, setIdeas] = React.useState<StartupIdea[]>(() => {
    const saved = localStorage.getItem('venturex_ideas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved ideas', e);
      }
    }
    return INITIAL_IDEAS;
  });

  const [users, setUsers] = React.useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('venturex_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return INITIAL_USERS;
  });

  const [proposals, setProposals] = React.useState<PartnershipProposal[]>(() => {
    const saved = localStorage.getItem('venturex_proposals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved proposals', e);
      }
    }
    return INITIAL_PARTNERSHIP_PROPOSALS;
  });

  // Current authenticated user (Default to Founder Elena Rostova)
  const [currentUser, setCurrentUser] = React.useState<UserProfile>(users[0]);

  // Views & navigation
  const [currentView, setCurrentView] = React.useState<
    'home' | 'marketplace' | 'dashboard' | 'partnerships' | 'admin' | 'pricing'
  >('home');

  // Modals
  const [selectedIdeaForDetail, setSelectedIdeaForDetail] = React.useState<StartupIdea | null>(null);
  const [selectedIdeaForAI, setSelectedIdeaForAI] = React.useState<StartupIdea | null>(null);
  const [selectedIdeaForWaitlist, setSelectedIdeaForWaitlist] = React.useState<StartupIdea | null>(null);
  const [selectedIdeaForPreorder, setSelectedIdeaForPreorder] = React.useState<StartupIdea | null>(null);
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist to local storage
  React.useEffect(() => {
    localStorage.setItem('venturex_ideas', JSON.stringify(ideas));
  }, [ideas]);

  React.useEffect(() => {
    localStorage.setItem('venturex_users', JSON.stringify(users));
  }, [users]);

  React.useEffect(() => {
    localStorage.setItem('venturex_proposals', JSON.stringify(proposals));
  }, [proposals]);

  // Sync selected detail idea when ideas change
  React.useEffect(() => {
    if (selectedIdeaForDetail) {
      const updated = ideas.find((i) => i.id === selectedIdeaForDetail.id);
      if (updated) setSelectedIdeaForDetail(updated);
    }
  }, [ideas]);

  // Voting handler with deduplication logic
  const handleVote = (ideaId: string, newVote: VoteType) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.id !== ideaId) return idea;

        const { updatedMap, previousVote, isNewVoter } = applyUserVote(
          idea.userVotes,
          currentUser.id,
          newVote
        );

        let posDelta = 0;
        let negDelta = 0;
        let maybeDelta = 0;

        if (isNewVoter) {
          if (newVote === 'yes') posDelta = 1;
          if (newVote === 'no') negDelta = 1;
          if (newVote === 'maybe') maybeDelta = 1;
        } else if (previousVote !== newVote) {
          // Decrement previous
          if (previousVote === 'yes') posDelta -= 1;
          if (previousVote === 'no') negDelta -= 1;
          if (previousVote === 'maybe') maybeDelta -= 1;
          // Increment new
          if (newVote === 'yes') posDelta += 1;
          if (newVote === 'no') negDelta += 1;
          if (newVote === 'maybe') maybeDelta += 1;
        }

        return {
          ...idea,
          positiveVotes: Math.max(0, idea.positiveVotes + posDelta),
          negativeVotes: Math.max(0, idea.negativeVotes + negDelta),
          maybeVotes: Math.max(0, idea.maybeVotes + maybeDelta),
          userVotes: updatedMap,
        };
      })
    );

    showToast(`Vote logged: ${newVote.toUpperCase()}`);
  };

  // Bookmark toggle
  const handleToggleBookmark = (ideaId: string) => {
    const isSaved = currentUser.savedIdeaIds.includes(ideaId);
    const updatedSaved = isSaved
      ? currentUser.savedIdeaIds.filter((id) => id !== ideaId)
      : [...currentUser.savedIdeaIds, ideaId];

    const updatedUser = { ...currentUser, savedIdeaIds: updatedSaved };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    showToast(isSaved ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  // Waitlist submission
  const handleWaitlistSubmit = (ideaId: string, name: string, email: string) => {
    const newEntry = {
      id: `w_${Date.now()}`,
      userId: currentUser.id,
      name,
      email,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;
        return {
          ...idea,
          waitlistCount: idea.waitlistCount + 1,
          waitlist: [newEntry, ...idea.waitlist],
        };
      })
    );

    showToast('You have joined the priority waitlist!');
  };

  // Conditional pre-order submission
  const handlePreorderSubmit = (
    ideaId: string,
    preorderData: {
      customerName: string;
      email: string;
      city: string;
      country: string;
      quantity: number;
      priceTier: number;
      deliveryExpectation: string;
    }
  ) => {
    const totalAmount = preorderData.quantity * preorderData.priceTier;
    const newPreorder = {
      id: `po_${Date.now()}`,
      userId: currentUser.id,
      customerName: preorderData.customerName,
      email: preorderData.email,
      city: preorderData.city,
      country: preorderData.country,
      quantity: preorderData.quantity,
      priceTier: preorderData.priceTier,
      totalAmount,
      status: 'pledged_conditional' as const,
      deliveryExpectation: preorderData.deliveryExpectation,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;
        return {
          ...idea,
          preordersCount: idea.preordersCount + 1,
          preordersVolume: idea.preordersVolume + totalAmount,
          preorders: [newPreorder, ...idea.preorders],
        };
      })
    );

    showToast(`Conditional Pre-Order Pledged: $${totalAmount}`);
  };

  // Feedback submission
  const handleFeedbackSubmit = (
    ideaId: string,
    fb: {
      rating: number;
      priceWillingness: number;
      mustHaveFeatures: string;
      concernsOrCritique: string;
    }
  ) => {
    const newFeedback = {
      id: `fb_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: fb.rating,
      priceWillingness: fb.priceWillingness,
      mustHaveFeatures: fb.mustHaveFeatures,
      concernsOrCritique: fb.concernsOrCritique,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;
        return {
          ...idea,
          feedbacks: [newFeedback, ...idea.feedbacks],
        };
      })
    );

    showToast('Feedback submitted to founder!');
  };

  // Comment submission
  const handleAddComment = (ideaId: string, content: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content,
      createdAt: 'Just now',
      upvotes: 0,
      upvotedBy: [],
    };

    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;
        return {
          ...idea,
          comments: [newComment, ...idea.comments],
        };
      })
    );

    showToast('Comment posted!');
  };

  const handleUpvoteComment = (ideaId: string, commentId: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;
        return {
          ...idea,
          comments: idea.comments.map((c) => {
            if (c.id !== commentId) return c;
            const alreadyUpvoted = c.upvotedBy.includes(currentUser.id);
            return {
              ...c,
              upvotes: alreadyUpvoted ? c.upvotes - 1 : c.upvotes + 1,
              upvotedBy: alreadyUpvoted
                ? c.upvotedBy.filter((id) => id !== currentUser.id)
                : [...c.upvotedBy, currentUser.id],
            };
          }),
        };
      })
    );
  };

  // Submit new startup idea with instant AI Analysis
  const handleCreateIdea = async (ideaData: Partial<StartupIdea>) => {
    // 1. Call server-side Gemini AI analysis endpoint
    let aiAnalysisData = undefined;
    try {
      const res = await fetch('/api/ai/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ideaData.name,
          category: ideaData.category,
          shortDescription: ideaData.shortDescription,
          detailedExplanation: ideaData.detailedExplanation,
          problem: ideaData.problem,
          targetAudience: ideaData.targetAudience,
          estimatedPrice: ideaData.estimatedPrice,
          estimatedBudget: ideaData.estimatedBudget,
        }),
      });
      if (res.ok) {
        aiAnalysisData = await res.json();
      }
    } catch (e) {
      console.warn('AI Analysis call failed, using default generation:', e);
    }

    const newIdea: StartupIdea = {
      id: `idea_${Date.now()}`,
      name: ideaData.name || 'Untitled Startup Concept',
      tagline: ideaData.tagline || '',
      category: ideaData.category || 'Technology',
      shortDescription: ideaData.shortDescription || '',
      detailedExplanation: ideaData.detailedExplanation || '',
      problem: ideaData.problem || '',
      targetAudience: ideaData.targetAudience || '',
      estimatedPrice: ideaData.estimatedPrice || 99,
      estimatedBudget: ideaData.estimatedBudget || 50000,
      launchDate: ideaData.launchDate || '2026-12-01',
      imageUrl: ideaData.imageUrl || '/src/assets/images/venturex_hero_concept_1794500950973.jpg',
      founder: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        bio: currentUser.bio || 'Founder and strategist',
      },
      status: 'validating',
      positiveVotes: 1,
      negativeVotes: 0,
      maybeVotes: 0,
      userVotes: { [currentUser.id]: 'yes' },
      waitlistCount: 1,
      preordersCount: 0,
      preordersVolume: 0,
      waitlist: [
        {
          id: `w_init`,
          email: currentUser.email,
          name: currentUser.name,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
      preorders: [],
      feedbacks: [],
      comments: [],
      aiAnalysis: aiAnalysisData,
      interestHistory: [
        { date: 'Today', votes: 1, positiveRatio: 100 },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIdeas([newIdea, ...ideas]);
    setCurrentView('dashboard');
    showToast('Startup Idea Published & AI Validation Complete!');
    if (newIdea.aiAnalysis) {
      setSelectedIdeaForAI(newIdea);
    }
  };

  // Partnership proposal creation
  const handleCreateProposal = (proposalData: Partial<PartnershipProposal>) => {
    const newProposal: PartnershipProposal = {
      id: `prop_${Date.now()}`,
      ideaId: proposalData.ideaId || '',
      ideaName: proposalData.ideaName || '',
      founderId: proposalData.founderId || '',
      founderName: proposalData.founderName || '',
      investorId: currentUser.id,
      investorName: currentUser.name,
      investorEmail: currentUser.email,
      type: proposalData.type || 'Angel Investment',
      amountProposed: proposalData.amountProposed,
      equityPercentage: proposalData.equityPercentage,
      message: proposalData.message || '',
      status: 'under_review',
      documentName: proposalData.documentName,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProposals([newProposal, ...proposals]);
    showToast('Partnership proposal submitted!');
  };

  // Role Switcher
  const handleSwitchRole = (newRole: UserRole) => {
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast(`Role switched to ${newRole.toUpperCase()}`);
    if (newRole === 'admin') setCurrentView('admin');
  };

  // Admin Actions
  const handleApproveIdea = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, status: 'approved' as const } : i))
    );
    showToast('Idea approved for marketplace!');
  };

  const handleRejectIdea = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, status: 'rejected' as const } : i))
    );
    showToast('Idea flagged/rejected.');
  };

  const handleDeleteComment = (ideaId: string, commentId: string) => {
    setIdeas((prev) =>
      prev.map((i) => {
        if (i.id !== ideaId) return i;
        return {
          ...i,
          comments: i.comments.filter((c) => c.id !== commentId),
        };
      })
    );
    showToast('Comment removed by moderator.');
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
    showToast(`Updated user role to ${newRole}`);
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col font-sans selection:bg-[#7262F4]/30 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#7262F4] text-white text-xs font-semibold shadow-2xl shadow-[#7262F4]/50 animate-in fade-in slide-in-from-bottom-3 flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenSubmitModal={() => setShowSubmitModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onSwitchRole={handleSwitchRole}
        onLogout={() => {
          showToast('Signed out');
          setShowAuthModal(true);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              onValidateClick={() => setShowSubmitModal(true)}
              onExploreClick={() => setCurrentView('marketplace')}
            />

            {/* Featured Startups Section */}
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC] mb-1">
                    HIGH-SIGNAL STARTUPS
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Featured Ideas Validating Right Now
                  </h2>
                </div>

                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="text-xs font-semibold text-[#9B8DFC] hover:text-white transition-colors"
                >
                  View All Marketplace Startups →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ideas.slice(0, 4).map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => setSelectedIdeaForDetail(idea)}
                    className="group rounded-2xl bg-[#0D1222] border border-slate-800 hover:border-[#7262F4]/50 transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                        <img
                          src={idea.imageUrl}
                          alt={idea.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#7262F4] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          ${idea.estimatedPrice}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="text-[11px] text-slate-400 mb-1">{idea.category}</div>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#9B8DFC] transition-colors truncate">
                          {idea.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {idea.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-850">
                      <span className="font-semibold text-emerald-400 tabular-nums">
                        {idea.positiveVotes} Would Buy
                      </span>
                      <span className="text-slate-500">{idea.waitlistCount} Waitlist</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <HowItWorksSection onStartClick={() => setShowSubmitModal(true)} />
            <SuccessStoriesSection />
            <PricingSection onSelectPlan={(plan) => setShowSubmitModal(true)} />
            <FAQSection />
          </>
        )}

        {currentView === 'marketplace' && (
          <MarketplaceView
            ideas={ideas}
            currentUser={currentUser}
            onSelectIdea={(idea) => setSelectedIdeaForDetail(idea)}
            onToggleBookmark={handleToggleBookmark}
            onQuickVote={handleVote}
          />
        )}

        {currentView === 'dashboard' && (
          <FounderDashboard
            ideas={ideas}
            currentUser={currentUser}
            onOpenSubmitModal={() => setShowSubmitModal(true)}
            onSelectIdea={(idea) => setSelectedIdeaForDetail(idea)}
            onOpenAIAnalysis={(idea) => setSelectedIdeaForAI(idea)}
          />
        )}

        {currentView === 'partnerships' && (
          <PartnershipHub
            ideas={ideas}
            proposals={proposals}
            currentUser={currentUser}
            onSubmitProposal={handleCreateProposal}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            ideas={ideas}
            users={users}
            onApproveIdea={handleApproveIdea}
            onRejectIdea={handleRejectIdea}
            onDeleteComment={handleDeleteComment}
            onUpdateUserRole={handleUpdateUserRole}
            onSelectIdea={(idea) => setSelectedIdeaForDetail(idea)}
          />
        )}

        {currentView === 'pricing' && (
          <div className="py-8">
            <PricingSection onSelectPlan={(plan) => setShowSubmitModal(true)} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(view) => setCurrentView(view)} />

      {/* Modals Container */}
      {selectedIdeaForDetail && (
        <IdeaDetailModal
          idea={selectedIdeaForDetail}
          currentUser={currentUser}
          onClose={() => setSelectedIdeaForDetail(null)}
          onVote={(vote) => handleVote(selectedIdeaForDetail.id, vote)}
          onBookmark={() => handleToggleBookmark(selectedIdeaForDetail.id)}
          onOpenWaitlist={() => setSelectedIdeaForWaitlist(selectedIdeaForDetail)}
          onOpenPreorder={() => setSelectedIdeaForPreorder(selectedIdeaForDetail)}
          onOpenAIAnalysis={() => setSelectedIdeaForAI(selectedIdeaForDetail)}
          onAddComment={(content) => handleAddComment(selectedIdeaForDetail.id, content)}
          onUpvoteComment={(commentId) => handleUpvoteComment(selectedIdeaForDetail.id, commentId)}
          onSubmitFeedback={(fb) => handleFeedbackSubmit(selectedIdeaForDetail.id, fb)}
        />
      )}

      {selectedIdeaForAI && selectedIdeaForAI.aiAnalysis && (
        <AIAnalysisModal
          idea={selectedIdeaForAI}
          analysis={selectedIdeaForAI.aiAnalysis}
          onClose={() => setSelectedIdeaForAI(null)}
        />
      )}

      {selectedIdeaForWaitlist && (
        <WaitlistModal
          idea={selectedIdeaForWaitlist}
          currentUser={currentUser}
          onClose={() => setSelectedIdeaForWaitlist(null)}
          onSubmitWaitlist={(name, email) =>
            handleWaitlistSubmit(selectedIdeaForWaitlist.id, name, email)
          }
        />
      )}

      {selectedIdeaForPreorder && (
        <PreorderModal
          idea={selectedIdeaForPreorder}
          currentUser={currentUser}
          onClose={() => setSelectedIdeaForPreorder(null)}
          onSubmitPreorder={(data) => handlePreorderSubmit(selectedIdeaForPreorder.id, data)}
        />
      )}

      {showSubmitModal && (
        <SubmitIdeaModal
          currentUser={currentUser}
          onClose={() => setShowSubmitModal(false)}
          onSubmitIdea={handleCreateIdea}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={(user) => {
            setCurrentUser(user);
            showToast(`Signed in as ${user.name}`);
          }}
        />
      )}

      {showProfileModal && (
        <UserProfileModal
          currentUser={currentUser}
          ideas={ideas}
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={(updated) => {
            const newUser = { ...currentUser, ...updated };
            setCurrentUser(newUser);
            setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? newUser : u)));
            showToast('Profile updated!');
          }}
          onSelectIdea={(idea) => setSelectedIdeaForDetail(idea)}
        />
      )}
    </div>
  );
}
