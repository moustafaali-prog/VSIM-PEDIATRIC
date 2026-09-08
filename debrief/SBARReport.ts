import { ClinicalState } from "../clinical/ClinicalState";
import { AuditEvent } from "../audit/AuditLog";

export interface SBARReport {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
}

export function buildSBAR(
  state: ClinicalState,
  events: readonly AuditEvent[],
): SBARReport {
  const actions = events
    .filter((e) => e.type === "action" && e.action?.accepted)
    .map((e) => e.action!.actionId);

  return {
    situation:
      "Pediatric simulation patient under active assessment; current status derived from the scenario state.",
    background:
      "See the scenario EHR for history, diagnosis, allergies, orders, and baseline data.",
    assessment:
      `HR=${state.cardiovascular.heartRate ?? "NA"}; ` +
      `RR=${state.respiratory.rate ?? "NA"}; ` +
      `SpO2=${state.respiratory.oxygenSaturation ?? "NA"}; ` +
      `BP=${state.cardiovascular.systolicBP ?? "NA"}/${state.cardiovascular.diastolicBP ?? "NA"}; ` +
      `Pain=${state.pain.score ?? "NA"}. Actions recorded: ${actions.join(", ") || "none"}.`,
    recommendation:
      "Continue monitoring, reassessment, documentation, and escalation according to the validated scenario order set.",
  };
}
