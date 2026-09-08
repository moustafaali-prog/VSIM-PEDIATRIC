import { ClinicalState } from "../clinical/ClinicalState";
import { ScenarioDefinition, ScenarioEvent } from "./ScenarioSchema";

export class ScenarioEngine {
  private fired = new Set<string>();

  constructor(private readonly scenario: ScenarioDefinition) {}

  reset(): void {
    this.fired.clear();
  }

  tick(state: ClinicalState): void {
    for (const event of this.scenario.events) {
      if (event.once && this.fired.has(event.id)) continue;
      if (this.matches(event, state)) {
        event.execute(state);
        if (event.once) this.fired.add(event.id);
      }
    }
  }

  private matches(event: ScenarioEvent, state: ClinicalState): boolean {
    if (event.trigger.type === "time") {
      return state.timeSeconds >= event.trigger.atSeconds;
    }
    return false; // action-trigger execution is handled by SimulationController.
  }

  handleAction(actionId: string, state: ClinicalState): void {
    for (const event of this.scenario.events) {
      if (event.once && this.fired.has(event.id)) continue;
      if (
        event.trigger.type === "action" &&
        event.trigger.actionId === actionId
      ) {
        event.execute(state);
        if (event.once) this.fired.add(event.id);
      }
    }
  }
}
