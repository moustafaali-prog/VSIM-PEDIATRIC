export class WebAudioMonitor {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private lastBeat = -1;
  enable(): void { this.enabled = true; }
  disable(): void { this.enabled = false; }
  private ensure(): AudioContext | null {
    if(!this.enabled || typeof window === "undefined") return null;
    if(!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }
  beep(timeSeconds:number, heartRate:number|null): void {
    const ctx=this.ensure(); if(!ctx || heartRate==null || heartRate<=0) return;
    const period=60/heartRate;
    if(this.lastBeat<0) this.lastBeat=timeSeconds-period;
    if(timeSeconds-this.lastBeat<period) return;
    this.lastBeat=timeSeconds;
    const osc=ctx.createOscillator(); const gain=ctx.createGain();
    osc.type="sine"; osc.frequency.value=880; gain.gain.setValueAtTime(.0001,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.045,ctx.currentTime+.005); gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.055);
    osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+.06);
  }
}
