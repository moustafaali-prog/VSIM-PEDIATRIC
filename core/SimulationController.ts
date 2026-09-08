import { ClinicalActionId, ActionContext } from "../clinical/ActionTypes";
import { ClinicalState } from "../clinical/ClinicalState";
import { StateManager } from "./StateManager";
import { SimulationClock } from "./SimulationClock";
import { EventEngine } from "./EventEngine";
import { SafetyEngine } from "./SafetyEngine";
import { ScenarioEngine } from "../scenarios/ScenarioEngine";
import { AuditLog } from "../audit/AuditLog";
import { CJMMEngine } from "../assessment/CJMMEngine";
import { PerformanceScoringEngine } from "../assessment/PerformanceScoringEngine";
import { ScenarioDefinition } from "../scenarios/ScenarioSchema";

export class SimulationController {
  readonly clock: SimulationClock;
  readonly state: StateManager;
  readonly audit = new AuditLog();
  readonly cjmm = new CJMMEngine();
  readonly performance = new PerformanceScoringEngine();
  readonly scenarioEngine: ScenarioEngine;

  constructor(
    scenario: ScenarioDefinition,
    private readonly safety: SafetyEngine,
    private readonly events: EventEngine,
  ) {
    this.clock = new SimulationClock();
    this.state = new StateManager(structuredClone(scenario.initialState));
    this.scenarioEngine = new ScenarioEngine(scenario);
  }

  start(): void {
    this.clock.start();
  }

  pause(): void {
    this.clock.pause();
  }

  update(deltaSeconds: number): void {
    this.clock.update(deltaSeconds);
    this.state.update((s) => {
      s.timeSeconds = this.clock.timeSeconds;
    });
    this.scenarioEngine.tick(this.state.mutableState());
    this.events.update(this.state.mutableState());
  }

  performAction(actionId: ClinicalActionId, note?: string): boolean {
    const ctx: ActionContext = {
      actionId,
      simulationTimeSeconds: this.clock.timeSeconds,
      note,
    };

    const result = this.safety.evaluate(ctx, this.state.getState());
    const accepted = result.allowed;

    this.audit.append({
      timestamp: this.clock.timeSeconds,
      type: "action",
      message: accepted ? "Action accepted." : `Action blocked: ${result.reason}`,
      action: { ...ctx, accepted, reason: result.reason },
    });

    if (accepted) {
      this.scenarioEngine.handleAction(actionId, this.state.mutableState());
    }

    return accepted;
  }

  getState(): Readonly<ClinicalState> {
    return this.state.getState();
  }
}
