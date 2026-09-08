export type ClinicalActionId =
  | "review_ehr"
  | "hand_hygiene"
  | "identify_patient"
  | "check_allergies"
  | "initial_vitals"
  | "pat_assessment"
  | "auscultate_lungs"
  | "auscultate_heart"
  | "pupil_exam"
  | "capillary_refill"
  | "position_high_fowler"
  | "apply_oxygen"
  | "start_nebulizer"
  | "reassess_vitals"
  | "document"
  | "sbar_handover";

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
