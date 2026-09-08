import type { ClinicalActionId } from "../clinical/ActionTypes";
import type { ActionPerformer } from "./InteractionActionRouter";
import { ProcedureStateMachine, type ProcedureId } from "../procedures/ProcedureStateMachine";
import { getInteraction } from "../scene/InteractionRegistry";

export interface ProcedureInteractionResult {
  accepted: boolean;
  started: boolean;
  completed: boolean;
  actionId: ClinicalActionId;
  target: string;
  reason?: string;
}

/**
 * Deterministic bridge: scene target -> procedure progress -> clinical action.
 * Clinical state is changed only when the procedure reaches completion and
 * the controller's safety gate accepts the corresponding action.
 */
export class ProcedureInteractionRuntime {
  private visualListener?: (state: { id: ProcedureId | null; phase: any; progress: number; target: string | null }) => void;
  private readonly procedure = new ProcedureStateMachine();
  private pending?: { actionId: ClinicalActionId; target: string; procedure: ProcedureId };

  constructor(private readonly runtime: ActionPerformer) {}

  onVisualState(listener: (state: { id: ProcedureId | null; phase: any; progress: number; target: string | null }) => void): void {
    this.visualListener = listener;
  }

  begin(actionId: ClinicalActionId, target: string): ProcedureInteractionResult {
    const definition = getInteraction(actionId);
    if (!definition || definition.target !== target) {
      return { accepted: false, started: false, completed: false, actionId, target, reason: "Target/action mismatch" };
    }

    if (!definition.procedure) {
      const accepted = this.runtime.perform(actionId, undefined, target);
      return { accepted, started: false, completed: accepted, actionId, target, reason: accepted ? undefined : "Safety gate blocked action" };
    }

    this.procedure.begin(definition.procedure as ProcedureId);
    this.pending = { actionId, target, procedure: definition.procedure as ProcedureId };
    this.emitVisual(target);
    return { accepted: true, started: true, completed: false, actionId, target };
  }

  update(deltaSeconds: number): ProcedureInteractionResult | null {
    if (!this.pending) return null;
    this.procedure.update(deltaSeconds);
    const state = this.procedure.snapshot();
    this.emitVisual(this.pending.target);
    if (state.phase !== "complete") {
      return { accepted: true, started: true, completed: false, actionId: this.pending.actionId, target: this.pending.target };
    }

    const pending = this.pending;
    this.pending = undefined;
    this.emitVisual(null);
    const accepted = this.runtime.perform(pending.actionId, undefined, pending.target);
    return {
      accepted,
      started: true,
      completed: accepted,
      actionId: pending.actionId,
      target: pending.target,
      reason: accepted ? undefined : "Safety gate blocked action at completion",
    };
  }

  cancel(): void {
    if (this.pending) this.procedure.cancel();
    this.pending = undefined;
    this.emitVisual(null);
  }

  snapshot() { return this.procedure.snapshot(); }

  private emitVisual(target: string | null): void {
    const s = this.procedure.snapshot();
    this.visualListener?.({ id: s.phase === "idle" || s.phase === "cancelled" ? null : s.id, phase: s.phase, progress: s.progress, target });
  }
}
