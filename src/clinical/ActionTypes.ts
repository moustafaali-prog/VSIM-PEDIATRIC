export type ClinicalActionId =
  | "review_ehr" | "hand_hygiene" | "identify_patient" | "check_allergies"
  | "initial_vitals" | "pat_assessment" | "auscultate_lungs" | "auscultate_heart"
  | "pupil_exam" | "capillary_refill" | "position_high_fowler" | "position_left_lateral"
  | "position_knee_chest" | "apply_oxygen" | "start_nebulizer" | "blood_glucose_check"
  | "obtain_blood_cultures" | "review_labs" | "maintain_npo" | "oral_suction"
  | "call_emergency_team" | "reassess_vitals" | "reassess_neuro" | "document" | "sbar_handover";

export interface ActionContext {
  actionId: ClinicalActionId;
  simulationTimeSeconds: number;
  target?: string;
  note?: string;
}

export interface ActionRecord extends ActionContext {
  accepted: boolean;
  reason?: string;
}
