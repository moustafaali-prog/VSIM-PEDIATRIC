import { ActionRecord } from "../clinical/ActionTypes";

export interface AuditEvent {
  timestamp: number;
  type: "action" | "safety" | "clinical" | "system";
  message: string;
  action?: ActionRecord;
}

export class AuditLog {
  private readonly events: AuditEvent[] = [];

  append(event: AuditEvent): void {
    this.events.push({ ...event });
  }

  all(): readonly AuditEvent[] {
    return this.events;
  }

  actionRecords(): ActionRecord[] {
    return this.events
      .filter((e) => e.type === "action" && e.action)
      .map((e) => e.action!) ;
  }
}
