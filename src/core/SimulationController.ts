import type { ClinicalActionId, ActionContext } from "../clinical/ActionTypes";
import type { ClinicalState } from "../clinical/ClinicalState";
import { StateManager } from "./StateManager";
import { SimulationClock } from "./SimulationClock";
import { SafetyEngine } from "./SafetyEngine";
import { ScenarioEngine } from "../scenarios/ScenarioEngine";
import { AuditLog } from "../audit/AuditLog";
import { CJMMEngine } from "../assessment/CJMMEngine";
import { PerformanceScoringEngine } from "../assessment/PerformanceScoringEngine";
import type { ScenarioDefinition } from "../scenarios/ScenarioSchema";
import { IntegratedAssessmentEngine } from "../assessment/IntegratedAssessmentEngine";

export class SimulationController {
  readonly clock = new SimulationClock();
  readonly state: StateManager;
  readonly audit = new AuditLog();
  readonly cjmm = new CJMMEngine();
  readonly performance = new PerformanceScoringEngine();
  readonly scenarioEngine: ScenarioEngine;
  readonly safety: SafetyEngine;
  assessment: IntegratedAssessmentEngine;

  constructor(scenario: ScenarioDefinition, safety = new SafetyEngine()) {
    this.safety = safety;
    this.state = new StateManager(structuredClone(scenario.initialState));
    this.scenarioEngine = new ScenarioEngine(scenario);
    this.assessment = new IntegratedAssessmentEngine(scenario.id);
  }

  start(): void { this.clock.start(); }
  pause(): void { this.clock.pause(); }
  reset(scenario: ScenarioDefinition): void {
    this.clock.reset();
    this.state.replace(structuredClone(scenario.initialState));
    this.scenarioEngine.setScenario(scenario);
    this.assessment = new IntegratedAssessmentEngine(scenario.id);
    this.audit.clear();
  }

  update(deltaSeconds: number): void {
    this.clock.update(deltaSeconds);
    this.state.update(s => { s.timeSeconds = this.clock.timeSeconds; });
    this.scenarioEngine.tick(this.state.mutableState());
  }

  performAction(actionId: ClinicalActionId, note?: string, target?: string): boolean {
    const ctx: ActionContext = { actionId, simulationTimeSeconds: this.clock.timeSeconds, note, target };
    const result = this.safety.evaluate(ctx, this.state.getState());
    const accepted = result.allowed;
    this.audit.append({
      timestamp: this.clock.timeSeconds,
      type: "action",
      message: accepted ? "Action accepted." : `Action blocked: ${result.reason}`,
      action: { timestamp: this.clock.timeSeconds, ...ctx, accepted, reason: result.reason },
    });
    if (accepted) {
      if (actionId === "hand_hygiene") this.state.update(s => { s.audit.handHygieneCompleted = true; });
      if (actionId === "identify_patient") this.state.update(s => { s.audit.patientIdentified = true; });
      if (actionId === "check_allergies") this.state.update(s => { s.audit.allergyCheckCompleted = true; });
      this.scenarioEngine.handleAction(actionId, this.state.mutableState());
      this.assessment.recordAction({ ...ctx, accepted, reason: result.reason });
    }
    return accepted;
  }

  dispatchAction(actionId: string): boolean {
    return this.performAction(actionId as ClinicalActionId);
  }

  getState(): Readonly<ClinicalState> { return this.state.getState(); }
}
