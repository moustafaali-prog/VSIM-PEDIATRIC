import type { ClinicalState } from "../clinical/ClinicalState";
export class StateManager {
  private state: ClinicalState;
  constructor(initialState: ClinicalState) { this.state = initialState; }
  getState(): Readonly<ClinicalState> { return this.state; }
  mutableState(): ClinicalState { return this.state; }
  update(updater: (state: ClinicalState) => void): void { updater(this.state); }
  replace(next: ClinicalState): void { this.state = next; }
}
