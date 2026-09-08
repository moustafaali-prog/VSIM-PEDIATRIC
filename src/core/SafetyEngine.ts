import type { ClinicalState } from "../clinical/ClinicalState";
import type { ClinicalActionId, ActionContext } from "../clinical/ActionTypes";
export interface SafetyResult { allowed:boolean; status:"PASS"|"WARNING"|"CRITICAL_ERROR"; ruleId:string; message:string; penaltyPercent:number; reason?:string }
const NON_CONTACT: readonly ClinicalActionId[] = ["review_ehr","hand_hygiene","identify_patient","check_allergies","sbar_handover"];
export class SafetyEngine {
  evaluate(ctx: ActionContext, s: ClinicalState): SafetyResult {
    if (ctx.actionId === "hand_hygiene") return {allowed:true,status:"PASS",ruleId:"SAFETY-HAND-HYGIENE",message:"Hand hygiene action accepted.",penaltyPercent:0};
    if (ctx.actionId === "identify_patient") return {allowed:true,status:"PASS",ruleId:"SAFETY-ID",message:"Patient identification action accepted.",penaltyPercent:0};
    if (ctx.actionId === "check_allergies") return {allowed:true,status:"PASS",ruleId:"SAFETY-ALLERGY",message:"Allergy check action accepted.",penaltyPercent:0};
    if (NON_CONTACT.includes(ctx.actionId)) return {allowed:true,status:"PASS",ruleId:"SAFETY-NONCONTACT",message:"Non-contact action accepted.",penaltyPercent:0};
    if (!s.audit.handHygieneCompleted) return {allowed:false,status:"CRITICAL_ERROR",ruleId:"SAFETY-HAND-HYGIENE",message:"Hand hygiene is required before patient contact.",penaltyPercent:0,reason:"Hand hygiene incomplete."};
    if (!s.audit.patientIdentified) return {allowed:false,status:"CRITICAL_ERROR",ruleId:"SAFETY-PATIENT-ID",message:"Two-identifier patient check is required before patient contact.",penaltyPercent:15,reason:"Patient identification incomplete."};
    if (!s.audit.allergyCheckCompleted) return {allowed:false,status:"CRITICAL_ERROR",ruleId:"SAFETY-ALLERGY",message:"Allergy verification is required before clinical intervention.",penaltyPercent:0,reason:"Allergy verification incomplete."};
    return {allowed:true,status:"PASS",ruleId:"SAFETY-GATE-PASS",message:"Safety gate passed.",penaltyPercent:0};
  }
  checkBeforePatientContact(s: ClinicalState) { return [this.evaluate({actionId:"apply_oxygen",simulationTimeSeconds:s.timeSeconds},s)]; }
}
