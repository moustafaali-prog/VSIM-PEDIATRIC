import * as THREE from "three";

export interface InteractionTarget {
  id: string;
  object: THREE.Object3D;
  enabled: boolean;
}

export class RaycastInteraction {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly targets = new Map<string, InteractionTarget>();

  register(target: InteractionTarget): void {
    this.targets.set(target.id, target);
  }

  unregister(id: string): void {
    this.targets.delete(id);
  }

  hit(
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement,
    camera: THREE.Camera,
  ): string | null {
    const rect = canvas.getBoundingClientRect();

    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, camera);

    const enabled = [...this.targets.values()].filter((x) => x.enabled);
    const objects = enabled.map((x) => x.object);
    const hits = this.raycaster.intersectObjects(objects, true);

    if (!hits.length) return null;

    const firstHit = hits[0];
    if (!firstHit) return null;

    let node: THREE.Object3D | null = firstHit.object;
    while (node) {
      const match = enabled.find((x) => x.object === node);
      if (match) return match.id;
      node = node.parent;
    }

    return null;
  }
}
