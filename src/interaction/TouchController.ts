import * as THREE from "three";
import { RaycastInteraction } from "./RaycastInteraction";

export class TouchController {
  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly camera: THREE.Camera,
    private readonly raycast: RaycastInteraction,
    private readonly onTarget: (targetId: string) => void,
  ) {}

  attach(): void {
    const handler = (event: PointerEvent) => {
      const id = this.raycast.hit(
        event.clientX,
        event.clientY,
        this.canvas,
        this.camera,
      );
      if (id) this.onTarget(id);
    };

    this.canvas.addEventListener("pointerup", handler, { passive: true });
  }
}
