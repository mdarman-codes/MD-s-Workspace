/**
 * VENTUREX Startup Validation & Demand Analytics Engine
 * Pure logic calculations for voting, demand scores, and pre-order metrics.
 */

export type VoteType = 'yes' | 'no' | 'maybe';

export interface UserVoteRecord {
  userId: string;
  vote: VoteType;
  timestamp: string;
}

export interface ValidationStats {
  totalVotes: number;
  positiveVotes: number;
  negativeVotes: number;
  maybeVotes: number;
  positivePercentage: number;
  negativePercentage: number;
  maybePercentage: number;
  demandScore: number;
  validationStatus: 'Strong Demand' | 'Promising Validation' | 'Early Stage' | 'Needs Iteration';
}

/**
 * Calculates transparent validation metrics & holistic Demand Score (0-100)
 */
export function calculateValidationStats(
  positiveVotes: number,
  negativeVotes: number,
  maybeVotes: number,
  waitlistCount: number = 0,
  preordersCount: number = 0,
  targetPreorders: number = 50
): ValidationStats {
  const safePositive = Math.max(0, positiveVotes);
  const safeNegative = Math.max(0, negativeVotes);
  const safeMaybe = Math.max(0, maybeVotes);
  const totalVotes = safePositive + safeNegative + safeMaybe;

  const positivePercentage = totalVotes > 0 ? Math.round((safePositive / totalVotes) * 100) : 0;
  const negativePercentage = totalVotes > 0 ? Math.round((safeNegative / totalVotes) * 100) : 0;
  const maybePercentage = totalVotes > 0 ? Math.round((safeMaybe / totalVotes) * 100) : 0;

  // Sentiment component: 45% weight (positive votes ratio + half of maybe votes)
  const sentimentRatio = totalVotes > 0 ? (safePositive + safeMaybe * 0.5) / totalVotes : 0;
  const sentimentScore = sentimentRatio * 45;

  // Traction component: 25% weight (waitlist signups up to 100 target)
  const waitlistScore = Math.min(25, (waitlistCount / 100) * 25);

  // Intent / Pre-orders component: 30% weight (actual conditional commitments)
  const target = Math.max(1, targetPreorders);
  const preorderScore = Math.min(30, (preordersCount / target) * 30);

  const demandScore = Math.min(100, Math.max(0, Math.round(sentimentScore + waitlistScore + preorderScore)));

  let validationStatus: ValidationStats['validationStatus'] = 'Early Stage';
  if (totalVotes < 5 && waitlistCount < 5 && preordersCount < 2) {
    validationStatus = 'Early Stage';
  } else if (demandScore >= 70 && positivePercentage >= 65) {
    validationStatus = 'Strong Demand';
  } else if (demandScore >= 45) {
    validationStatus = 'Promising Validation';
  } else {
    validationStatus = 'Needs Iteration';
  }

  return {
    totalVotes,
    positiveVotes: safePositive,
    negativeVotes: safeNegative,
    maybeVotes: safeMaybe,
    positivePercentage,
    negativePercentage,
    maybePercentage,
    demandScore,
    validationStatus,
  };
}

/**
 * Handles deduplicated user voting: returns updated vote map and vote delta
 */
export function applyUserVote(
  existingVotes: Record<string, VoteType>,
  userId: string,
  newVote: VoteType
): {
  updatedMap: Record<string, VoteType>;
  previousVote: VoteType | null;
  isNewVoter: boolean;
} {
  const previousVote = existingVotes[userId] || null;
  const isNewVoter = previousVote === null;
  const updatedMap = {
    ...existingVotes,
    [userId]: newVote,
  };

  return {
    updatedMap,
    previousVote,
    isNewVoter,
  };
}

/**
 * Calculates conditional pre-order commitment volume
 */
export function calculatePreorderVolume(
  quantity: number,
  unitPrice: number
): { quantity: number; unitPrice: number; totalVolume: number } {
  const safeQty = Math.max(1, Math.floor(quantity || 1));
  const safePrice = Math.max(0, Number(unitPrice) || 0);
  return {
    quantity: safeQty,
    unitPrice: safePrice,
    totalVolume: Math.round(safeQty * safePrice * 100) / 100,
  };
}

/**
 * Computes deterministic Startup Readiness Score (0-100) based on submission parameters
 */
export function computeRuleBasedReadinessScore(params: {
  title: string;
  problem: string;
  detailedExplanation: string;
  targetAudience: string;
  estimatedPrice: number;
  estimatedBudget: number;
}): number {
  let score = 40; // baseline

  if (params.title && params.title.trim().length >= 3) score += 5;
  if (params.problem && params.problem.trim().length > 40) score += 15;
  if (params.detailedExplanation && params.detailedExplanation.trim().length > 60) score += 15;
  if (params.targetAudience && params.targetAudience.trim().length > 20) score += 10;
  if (params.estimatedPrice > 0 && params.estimatedPrice < 5000) score += 8;
  if (params.estimatedBudget > 0) score += 7;

  return Math.min(95, Math.max(25, score));
}
