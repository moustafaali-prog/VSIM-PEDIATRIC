import type { ClinicalActionId } from "../clinical/ActionTypes";
import { ProcedureInteractionRuntime } from "./ProcedureInteractionRuntime";
import { getInteraction } from "../scene/InteractionRegistry";
import type { SimulationRuntime } from "../core/SimulationRuntime";

export interface ActionPerformer { perform(actionId: ClinicalActionId, note?: string, target?: string): boolean; }

export interface RoutedAction {
  actionId: ClinicalActionId;
  target: string;
}

/** Single entry point for mouse/touch scene actions. */
export class InteractionActionRouter {
  readonly procedures: ProcedureInteractionRuntime;
  constructor(private readonly runtime: SimulationRuntime) {
    this.procedures = new ProcedureInteractionRuntime(runtime);
  }

  begin(target: string): ReturnType<ProcedureInteractionRuntime["begin"]> | null {
    const routed = this.route(target);
    return routed ? this.procedures.begin(routed.actionId, routed.target) : null;
  }

  route(target: string): RoutedAction | null {
    const definition = [...[
      "hand_hygiene", "identify_patient", "auscultate_lungs", "auscultate_heart",
      "pupil_exam", "apply_oxygen", "position_high_fowler",
    ] as ClinicalActionId[]].map(getInteraction).find(x => x?.target === target);
    if (!definition) return null;
    return { actionId: definition.actionId, target };
  }
}
