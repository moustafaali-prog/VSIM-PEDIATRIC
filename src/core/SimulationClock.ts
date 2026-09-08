export class SimulationClock {
  private elapsed = 0;
  private running = false;
  start(): void { this.running = true; }
  pause(): void { this.running = false; }
  reset(): void { this.elapsed = 0; this.running = false; }
  update(deltaSeconds: number): void {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) throw new Error("Invalid simulation delta.");
    if (this.running) this.elapsed += deltaSeconds;
  }
  get timeSeconds(): number { return this.elapsed; }
}
