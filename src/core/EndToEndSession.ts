import type { ClinicalActionId } from "../clinical/ActionTypes";
import type { ScenarioDefinition } from "../scenarios/ScenarioSchema";
import type { OperationalScenarioPackage } from "../scenarios/ScenarioPackage";
import { SimulationRuntime, type RuntimeSnapshot } from "./SimulationRuntime";
import { createScenarioEHR, appendRuntimeVitals, snapshotEHR } from "../ehr/ScenarioEHRBridge";
import { evaluateCompletion, type CompletionStatus } from "./SimulationCompletion";
import { buildDebrief, type DebriefReport } from "../debrief/DebriefEngine";
import type { SBARFormData } from "../ui/SBARForm";

export interface EndToEndSnapshot extends RuntimeSnapshot {
  ehr: ReturnType<typeof snapshotEHR>;
  completion: CompletionStatus;
}

/** One session boundary: clinical runtime + EHR projection + completion/debrief. */
export class EndToEndSession {
  readonly runtime: SimulationRuntime;
  private ehr;
  private sbar?: SBARFormData;

  constructor(scenario: OperationalScenarioPackage | ScenarioDefinition) {
    this.runtime = new SimulationRuntime(scenario);
    this.ehr = "catalog" in scenario ? createScenarioEHR(scenario) : null;
  }

  start(): void { this.runtime.start(); }
  pause(): void { this.runtime.pause(); }

  tick(deltaSeconds: number): EndToEndSnapshot {
    const snapshot = this.runtime.tick(deltaSeconds);
    if (this.ehr) appendRuntimeVitals(this.ehr, snapshot.state);
    return this.snapshot();
  }

  perform(actionId: ClinicalActionId, note?: string, target?: string): boolean {
    return this.runtime.perform(actionId, note, target);
  }

  setSBAR(form: SBARFormData): void { this.sbar = { ...form }; }

  snapshot(): EndToEndSnapshot {
    const base = this.runtime.snapshot();
    const entries = this.runtime.controller.audit.all();
    return {
      ...base,
      ehr: this.ehr ? snapshotEHR(this.ehr) : { patient: { id: "", displayName: "", ageYears: 0, weightKg: 0, allergies: [], diagnosis: "" }, vitals: [], labs: [], orders: [], notes: [] },
      completion: evaluateCompletion(base.state, entries, this.sbar),
    };
  }

  debrief(): DebriefReport {
    const c = this.runtime.controller;
    return buildDebrief(c.getState(), c.audit, c.assessment.performance, c.assessment.cjmm);
  }

  reset(scenario: OperationalScenarioPackage | ScenarioDefinition): void {
    this.runtime.reset(scenario);
    this.ehr = "catalog" in scenario ? createScenarioEHR(scenario) : null;
    this.sbar = undefined;
  }
}
