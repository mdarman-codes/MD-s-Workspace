import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateValidationStats,
  applyUserVote,
  calculatePreorderVolume,
  computeRuleBasedReadinessScore
} from './validationLogic.ts';

test('calculateValidationStats computes percentages and strong demand correctly', () => {
  const stats = calculateValidationStats(80, 10, 10, 80, 40, 50);
  assert.equal(stats.totalVotes, 100);
  assert.equal(stats.positivePercentage, 80);
  assert.equal(stats.negativePercentage, 10);
  assert.equal(stats.maybePercentage, 10);
  assert.ok(stats.demandScore >= 70, `Expected demandScore >= 70, got ${stats.demandScore}`);
  assert.equal(stats.validationStatus, 'Strong Demand');
});

test('calculateValidationStats handles zero votes gracefully', () => {
  const stats = calculateValidationStats(0, 0, 0, 0, 0);
  assert.equal(stats.totalVotes, 0);
  assert.equal(stats.positivePercentage, 0);
  assert.equal(stats.demandScore, 0);
  assert.equal(stats.validationStatus, 'Early Stage');
});

test('applyUserVote prevents duplicate voters and updates preferences correctly', () => {
  const initialMap = {};
  const vote1 = applyUserVote(initialMap, 'user_123', 'yes');
  assert.equal(vote1.isNewVoter, true);
  assert.equal(vote1.previousVote, null);
  assert.equal(vote1.updatedMap['user_123'], 'yes');

  // Same user changes mind to maybe
  const vote2 = applyUserVote(vote1.updatedMap, 'user_123', 'maybe');
  assert.equal(vote2.isNewVoter, false);
  assert.equal(vote2.previousVote, 'yes');
  assert.equal(vote2.updatedMap['user_123'], 'maybe');
});

test('calculatePreorderVolume calculates volume and sanitizes inputs', () => {
  const vol1 = calculatePreorderVolume(3, 149.99);
  assert.equal(vol1.quantity, 3);
  assert.equal(vol1.unitPrice, 149.99);
  assert.equal(vol1.totalVolume, 449.97);

  // Negative or invalid input fallback
  const vol2 = calculatePreorderVolume(-2, 50);
  assert.equal(vol2.quantity, 1);
  assert.equal(vol2.totalVolume, 50);
});

test('computeRuleBasedReadinessScore scores detailed ideas higher than sparse ideas', () => {
  const sparseScore = computeRuleBasedReadinessScore({
    title: 'A',
    problem: 'Short',
    detailedExplanation: 'Short',
    targetAudience: 'Everyone',
    estimatedPrice: 0,
    estimatedBudget: 0,
  });

  const detailedScore = computeRuleBasedReadinessScore({
    title: 'Lumina Biometric Ring',
    problem: 'Current health trackers are bulky wristwatches that disrupt sleep and lack clinical-grade vascular photoplethysmography sensors.',
    detailedExplanation: 'A featherlight matte titanium smart ring with embedded micro-spectrometry measuring vascular elasticity, circadian temperature shifts, and stress in real-time.',
    targetAudience: 'High-performing executives, athletes, and biohackers aged 24-50.',
    estimatedPrice: 249,
    estimatedBudget: 75000,
  });

  assert.ok(detailedScore > sparseScore);
  assert.ok(detailedScore >= 75);
});
