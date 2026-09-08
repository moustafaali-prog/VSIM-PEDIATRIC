export type ValidationStatus='VERIFIED'|'PENDING_VALIDATION'|'REJECTED';
export interface ClinicalConstant {id:string;value:number|string;unit?:string;source:string;status:ValidationStatus;}
export function requireVerified(c:ClinicalConstant):void{if(c.status!=='VERIFIED')throw new Error(`Clinical constant ${c.id} is not verified.`);}
