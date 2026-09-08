import type { ClinicalActionId } from "../clinical/ActionTypes";
import type { ClinicalState } from "../clinical/ClinicalState";
import type { ScenarioDefinition } from "../scenarios/ScenarioSchema";
import { SimulationController } from "./SimulationController";

export interface RuntimeSnapshot {
  timeSeconds: number;
  state: Readonly<ClinicalState>;
  scenarioId: string;
  assessment: ReturnType<SimulationController["assessment"]["snapshot"]>;
}

/** Single orchestration boundary for UI, scene, telemetry and assessment. */
export class SimulationRuntime {
  readonly controller: SimulationController;

  constructor(scenario: ScenarioDefinition) {
    this.controller = new SimulationController(scenario);
  }

  start(): void { this.controller.start(); }
  pause(): void { this.controller.pause(); }
  tick(deltaSeconds: number): RuntimeSnapshot {
    this.controller.update(deltaSeconds);
    return this.snapshot();
  }
  perform(actionId: ClinicalActionId, note?: string, target?: string): boolean {
    return this.controller.performAction(actionId, note, target);
  }
  reset(scenario: ScenarioDefinition): void { this.controller.reset(scenario); }
  snapshot(): RuntimeSnapshot {
    return {
      timeSeconds: this.controller.clock.timeSeconds,
      state: this.controller.getState(),
      scenarioId: this.controller.scenarioEngine.getScenario().id,
      assessment: this.controller.assessment.snapshot(),
    };
  }
}
