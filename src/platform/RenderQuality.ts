export type RenderQuality = "low" | "medium" | "high";

export interface RenderProfile {
  quality: RenderQuality;
  pixelRatioCap: number;
  shadows: boolean;
  postProcessing: boolean;
}

export function getRenderProfile(quality: RenderQuality): RenderProfile {
  switch (quality) {
    case "low": return { quality, pixelRatioCap: 1, shadows: false, postProcessing: false };
    case "medium": return { quality, pixelRatioCap: 1.5, shadows: true, postProcessing: false };
    case "high": return { quality, pixelRatioCap: 2, shadows: true, postProcessing: true };
  }
}
