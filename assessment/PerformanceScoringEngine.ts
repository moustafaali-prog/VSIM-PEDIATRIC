import { ActionRecord } from "../clinical/ActionTypes";

export interface PerformanceWeights {
  safety: 20;
  assessment: 25;
  interventions: 30;
  emergency: 15;
  communication: 10;
}

/**
 * File 07 defines the final performance domains.
 * File 04 defines CJMM as a separate cognitive-judgment profile.
 * They are deliberately not added together.
 */
export class PerformanceScoringEngine {
  readonly weights: PerformanceWeights = {
    safety: 20,
    assessment: 25,
    interventions: 30,
    emergency: 15,
    communication: 10,
  };

  private earned: PerformanceWeights = {
    safety: 0,
    assessment: 0,
    interventions: 0,
    emergency: 0,
    communication: 0,
  };

  setDomainScore(
    domain: keyof PerformanceWeights,
    score: number,
  ): void {
    this.earned[domain] = Math.max(
      0,
      Math.min(this.weights[domain], score),
    );
  }

  applyPenalty(domain: keyof PerformanceWeights, penalty: number): void {
    this.earned[domain] = Math.max(0, this.earned[domain] - Math.max(0, penalty));
  }

  total(): number {
    return Object.values(this.earned).reduce((a, b) => a + b, 0);
  }

  snapshot(): Readonly<PerformanceWeights> {
    return { ...this.earned };
  }
}
