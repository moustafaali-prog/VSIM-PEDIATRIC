import type {ClinicalState} from "../clinical/ClinicalState";
export type ScenarioTrigger={type:"time";atSeconds:number}|{type:"action";actionId:string};
export interface ScenarioEvent{id:string;once:boolean;trigger:ScenarioTrigger;execute:(s:ClinicalState)=>void}
export class EventEngine{
 private fired=new Set<string>();
 process(s:ClinicalState,events:readonly ScenarioEvent[],actionId?:string){
  for(const e of events){if(e.once&&this.fired.has(e.id))continue;
   const ok=e.trigger.type==="time"?s.timeSeconds>=e.trigger.atSeconds:e.trigger.actionId===actionId;
   if(ok){e.execute(s);if(e.once)this.fired.add(e.id)}
  }
 }
 reset(){this.fired.clear()}
}