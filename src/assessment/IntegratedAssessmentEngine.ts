import type { ActionRecord } from "../clinical/ActionTypes";
import type { CJMMStage } from "./CJMMEngine";
import { CJMMEngine } from "./CJMMEngine";
import { PerformanceScoringEngine } from "./PerformanceScoringEngine";
import { getScenarioClinicalMap, type ScenarioClinicalMap } from "../scenarios/ScenarioClinicalMap";

export interface IntegratedAssessmentSnapshot {
  performance: ReturnType<PerformanceScoringEngine["snapshot"]>;
  performanceTotal: number;
  cjmm: ReturnType<CJMMEngine["getScores"]>;
  cjmmTotal: number;
  completedCriteria: string[];
  missedCriteria: string[];
  validationBlockedCriteria: string[];
}

/**
 * Scenario-aware assessment adapter.
 * Scores are normalized inside each domain/stage, then mapped to the weights
 * already defined by FILE-04/FILE-07. Pending clinical-validation criteria
 * are deliberately excluded from the denominator so they cannot silently
 * distort a student's grade.
 */
export class IntegratedAssessmentEngine {
  readonly performance = new PerformanceScoringEngine();
  readonly cjmm = new CJMMEngine();
  private readonly map: ScenarioClinicalMap | undefined;
  private completed = new Set<string>();

  constructor(scenarioId: string) { this.map = getScenarioClinicalMap(scenarioId); }

  recordAction(record: ActionRecord): void {
    if (!record.accepted || !this.map) return;
    for (const c of this.map.criteria) {
      if (c.actionId !== record.actionId || this.completed.has(c.id) || c.validationStatus !== "SOURCE_SUPPORTED") continue;
      this.completed.add(c.id);
      this.recalculate();
    }
  }

  private recalculate(): void {
    if (!this.map) return;
    const domains = ["safety","assessment","interventions","emergency","communication"] as const;
    for (const domain of domains) {
      const eligible = this.map.criteria.filter(c => c.domain === domain && c.validationStatus === "SOURCE_SUPPORTED");
      const possible = eligible.reduce((n,c) => n+c.points,0);
      const earned = eligible.filter(c => this.completed.has(c.id)).reduce((n,c) => n+c.points,0);
      const max = this.performance.weights[domain];
      this.performance.setDomainScore(domain, possible === 0 ? 0 : (earned / possible) * max);
    }

    const stages: CJMMStage[] = ["recognize_cues","analyze_cues","prioritize_hypotheses","generate_solutions","take_action","evaluate_outcomes"];
    for (const stage of stages) {
      const eligible = this.map.criteria.filter(c => c.cjmmStage === stage && c.validationStatus === "SOURCE_SUPPORTED");
      const possible = eligible.reduce((n,c) => n+c.points,0);
      const earned = eligible.filter(c => this.completed.has(c.id)).reduce((n,c) => n+c.points,0);
      const weight = this.cjmm.getScores().find(s=>s.stage===stage)!.possible;
      this.cjmm.record(stage, possible === 0 ? 0 : (earned / possible) * weight);
    }
  }

  snapshot(): IntegratedAssessmentSnapshot {
    const criteria = this.map?.criteria ?? [];
    return {
      performance: this.performance.snapshot(),
      performanceTotal: Number(this.performance.total().toFixed(2)),
      cjmm: this.cjmm.getScores(),
      cjmmTotal: Number(this.cjmm.total().toFixed(2)),
      completedCriteria: [...this.completed],
      missedCriteria: criteria.filter(c => !this.completed.has(c.id) && c.validationStatus === "SOURCE_SUPPORTED").map(c => c.id),
      validationBlockedCriteria: criteria.filter(c => c.validationStatus === "PENDING_CLINICAL_VALIDATION").map(c => c.id),
    };
  }
}
