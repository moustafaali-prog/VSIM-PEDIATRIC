import type { ClinicalActionId } from "../clinical/ActionTypes";
export type ActionId = ClinicalActionId;
export interface SafetyGateState { handHygieneCompleted:boolean; patientIdentified:boolean; allergiesChecked:boolean; }
export class ActionGate {
  constructor(private readonly s: SafetyGateState) {}
  canTouchPatient(a: ActionId) {
    const safe: readonly ActionId[] = ["hand_hygiene","identify_patient","check_allergies"];
    if (safe.includes(a)) return true;
    return this.s.handHygieneCompleted && this.s.patientIdentified && this.s.allergiesChecked;
  }
  record(a: ActionId) {
    if (a === "hand_hygiene") this.s.handHygieneCompleted = true;
    if (a === "identify_patient") this.s.patientIdentified = true;
    if (a === "check_allergies") this.s.allergiesChecked = true;
  }
}
