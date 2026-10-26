import { describe, it, expect } from 'vitest';
import { PRIORITY_WEIGHTS } from '../src/config/constants';

describe('Priority Calculation', () => {
  function calculatePriorityScore(
    factors: {
      populationRisk: number;
      buildingDamage: number;
      isolation: number;
      roadAccessibilityRisk: number;
      disasterSeverity: number;
    },
    weights = PRIORITY_WEIGHTS
  ): number {
    const score =
      factors.populationRisk * weights.populationRisk +
      factors.buildingDamage * weights.buildingDamage +
      factors.isolation * weights.isolation +
      factors.roadAccessibilityRisk * weights.roadAccessibilityRisk +
      factors.disasterSeverity * weights.disasterSeverity;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function classifyPriority(score: number): string {
    if (score >= 70) return 'RED';
    if (score >= 40) return 'ORANGE';
    return 'GREEN';
  }

  it('should calculate RED priority for severe scenario', () => {
    const score = calculatePriorityScore({
      populationRisk: 90,
      buildingDamage: 85,
      isolation: 80,
      roadAccessibilityRisk: 75,
      disasterSeverity: 100,
    });

    expect(score).toBeGreaterThanOrEqual(70);
    expect(classifyPriority(score)).toBe('RED');
  });

  it('should calculate GREEN priority for mild scenario', () => {
    const score = calculatePriorityScore({
      populationRisk: 10,
      buildingDamage: 15,
      isolation: 5,
      roadAccessibilityRisk: 10,
      disasterSeverity: 25,
    });

    expect(score).toBeLessThan(40);
    expect(classifyPriority(score)).toBe('GREEN');
  });

  it('should calculate ORANGE priority for moderate scenario', () => {
    const score = calculatePriorityScore({
      populationRisk: 50,
      buildingDamage: 45,
      isolation: 55,
      roadAccessibilityRisk: 40,
      disasterSeverity: 50,
    });

    expect(score).toBeGreaterThanOrEqual(40);
    expect(score).toBeLessThan(70);
    expect(classifyPriority(score)).toBe('ORANGE');
  });

  it('should clamp score between 0 and 100', () => {
    const highScore = calculatePriorityScore({
      populationRisk: 200,
      buildingDamage: 200,
      isolation: 200,
      roadAccessibilityRisk: 200,
      disasterSeverity: 200,
    });
    expect(highScore).toBeLessThanOrEqual(100);

    const lowScore = calculatePriorityScore({
      populationRisk: -50,
      buildingDamage: -50,
      isolation: -50,
      roadAccessibilityRisk: -50,
      disasterSeverity: -50,
    });
    expect(lowScore).toBeGreaterThanOrEqual(0);
  });

  it('should respect weight distribution (sum to 1.0)', () => {
    const totalWeight = Object.values(PRIORITY_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(totalWeight).toBeCloseTo(1.0, 5);
  });
});
