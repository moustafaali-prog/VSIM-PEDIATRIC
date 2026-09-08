export type CJMMStage =
  | "recognize_cues" | "analyze_cues" | "prioritize_hypotheses"
  | "generate_solutions" | "take_action" | "evaluate_outcomes";

const WEIGHTS: Record<CJMMStage, number> = {
  recognize_cues: 15, analyze_cues: 15, prioritize_hypotheses: 15,
  generate_solutions: 15, take_action: 25, evaluate_outcomes: 15,
};

export interface CJMMScore { stage: CJMMStage; earned: number; possible: number; }

export class CJMMEngine {
  private scores = new Map<CJMMStage, number>();

  constructor() {
    (Object.keys(WEIGHTS) as CJMMStage[]).forEach((s) => this.scores.set(s, 0));
  }

  record(stage: CJMMStage, points: number): void {
    this.scores.set(stage, Math.max(0, Math.min(WEIGHTS[stage], points)));
  }

  getScores(): CJMMScore[] {
    return (Object.keys(WEIGHTS) as CJMMStage[]).map((stage) => ({
      stage, earned: this.scores.get(stage) ?? 0, possible: WEIGHTS[stage],
    }));
  }

  total(): number {
    return this.getScores().reduce((sum, x) => sum + x.earned, 0);
  }
}
