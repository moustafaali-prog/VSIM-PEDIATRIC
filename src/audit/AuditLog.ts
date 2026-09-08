export interface AuditActionRecord {
  timestamp:number; actionId:string; accepted:boolean; reason?:string; note?:string; simulationTimeSeconds?:number; target?:string;
}
export interface AuditEntry {
  timestamp:number; type:string; message:string; action?:AuditActionRecord;
}
export class AuditLog {
  private entries: AuditEntry[] = [];
  append(entry: AuditEntry): void { this.entries.push({...entry}); }
  clear(): void { this.entries = []; }
  snapshot(): readonly AuditEntry[] { return [...this.entries]; }
  all(): readonly AuditEntry[] { return this.snapshot(); }
  actionRecords(): readonly AuditActionRecord[] { return this.entries.filter(e => e.type === "action" && e.action).map(e => ({...e.action!})); }
}
