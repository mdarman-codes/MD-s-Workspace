export type UserRole = 'founder' | 'voter' | 'admin' | 'investor';
export type VoteType = 'yes' | 'no' | 'maybe';

export type IdeaCategory =
  | 'Food & Beverages'
  | 'Fashion & Clothing'
  | 'Beauty & Skincare'
  | 'Technology'
  | 'Mobile Applications'
  | 'Education'
  | 'Lifestyle'
  | 'Health & Fitness'
  | 'Other';

export type IdeaStatus = 'validating' | 'approved' | 'preorder_ready' | 'funded' | 'rejected' | 'in_moderation';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio?: string;
  company?: string;
  savedIdeaIds: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  priceWillingness: number;
  mustHaveFeatures: string;
  concernsOrCritique: string;
  createdAt: string;
}

export interface WaitlistEntry {
  id: string;
  userId?: string;
  email: string;
  name: string;
  createdAt: string;
  notes?: string;
}

export interface PreorderEntry {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  city: string;
  country: string;
  quantity: number;
  priceTier: number;
  totalAmount: number;
  status: 'pledged_conditional' | 'confirmed';
  deliveryExpectation: string;
  createdAt: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AIStartupAnalysis {
  readinessScore: number; // 0-100
  marketOpportunity: string;
  targetCustomer: string;
  competitorAnalysis: string;
  productPositioning: string;
  pricingSuggestion: string;
  potentialRisks: string[];
  swot: SWOTAnalysis;
  recommendations: string[];
  validationQuestions: string[];
  generatedAt: string;
  disclaimer: string;
}

export interface StartupIdea {
  id: string;
  name: string;
  tagline: string;
  category: IdeaCategory;
  shortDescription: string;
  detailedExplanation: string;
  problem: string;
  targetAudience: string;
  estimatedPrice: number;
  estimatedBudget: number;
  launchDate: string;
  imageUrl: string;
  founder: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  status: IdeaStatus;
  positiveVotes: number;
  negativeVotes: number;
  maybeVotes: number;
  userVotes: Record<string, 'yes' | 'no' | 'maybe'>;
  waitlistCount: number;
  preordersCount: number;
  preordersVolume: number;
  waitlist: WaitlistEntry[];
  preorders: PreorderEntry[];
  feedbacks: FeedbackItem[];
  comments: Comment[];
  aiAnalysis?: AIStartupAnalysis;
  interestHistory: { date: string; votes: number; positiveRatio: number }[];
  featured?: boolean;
  createdAt: string;
}

export interface PartnershipProposal {
  id: string;
  ideaId: string;
  ideaName: string;
  founderId: string;
  founderName: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  type: 'Mentorship' | 'Angel Investment' | 'Distribution Partnership' | 'Equity Collaboration';
  amountProposed?: string;
  equityPercentage?: string;
  message: string;
  status: 'under_review' | 'accepted' | 'declined';
  documentName?: string;
  createdAt: string;
}
