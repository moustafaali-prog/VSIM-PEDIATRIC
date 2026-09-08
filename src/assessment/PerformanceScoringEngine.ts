export interface PerformanceWeights { safety:number; assessment:number; interventions:number; emergency:number; communication:number; }
export interface PerformanceScores { safety:number; assessment:number; interventions:number; emergency:number; communication:number; }
const DEFAULT_WEIGHTS: PerformanceWeights={safety:20,assessment:25,interventions:30,emergency:15,communication:10};
export class PerformanceScoringEngine {
 readonly weights:Readonly<PerformanceWeights>=DEFAULT_WEIGHTS;
 private earned:PerformanceScores={safety:0,assessment:0,interventions:0,emergency:0,communication:0};
 setDomainScore(domain:keyof PerformanceWeights,score:number){if(!Number.isFinite(score))throw new Error('Score must be finite');this.earned[domain]=Math.max(0,Math.min(this.weights[domain],score));}
 applyPenalty(domain:keyof PerformanceWeights,penalty:number){if(!Number.isFinite(penalty)||penalty<0)throw new Error('Penalty must be non-negative');this.earned[domain]=Math.max(0,this.earned[domain]-penalty);}
 total(){return Object.values(this.earned).reduce((a,b)=>a+b,0)}
 snapshot(){return {...this.earned};}
}
