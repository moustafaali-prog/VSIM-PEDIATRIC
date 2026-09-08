import { ClinicalActionId } from "../clinical/ActionTypes";

export const CLINICAL_INTERACTION_MAP: Record<string, ClinicalActionId> = {
  clickable_chest: "auscultate_lungs",
  clickable_heart: "auscultate_heart",
  clickable_patient: "pat_assessment",
  clickable_head: "pupil_exam",
  clickable_wristband: "identify_patient",
  clickable_arm: "pat_assessment",
  clickable_wrist: "pat_assessment",
  clickable_bed: "position_high_fowler",
  clickable_bed_head: "position_high_fowler",
  clickable_oxygen: "apply_oxygen",
  clickable_monitor: "initial_vitals",
  clickable_handwash: "hand_hygiene",
};
