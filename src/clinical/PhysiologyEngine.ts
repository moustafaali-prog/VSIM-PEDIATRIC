import type {ClinicalState} from "./ClinicalState";
export class PhysiologyEngine{
 static airwayResistanceLaminar(mu:number,L:number,r:number){
  if(mu<=0||L<=0||r<=0)throw new Error("Physical parameters must be positive.");
  return 8*mu*L/(Math.PI*Math.pow(r,4));
 }
 static alveolarOxygen(Patm:number,PH2O:number,FiO2:number,PaCO2:number,RQ:number){
  if(FiO2<=0||FiO2>1||RQ<=0)throw new Error("Invalid gas parameters.");
  return (Patm-PH2O)*FiO2-PaCO2/RQ;
 }
 static hillSaturation(PaO2:number,P50:number,n=2.7){
  if(PaO2<0||P50<=0||n<=0)throw new Error("Invalid Hill parameters.");
  const x=Math.pow(PaO2,n);return 100*x/(x+Math.pow(P50,n));
 }
 syncTime(s:ClinicalState,t:number){s.timeSeconds=t}
}