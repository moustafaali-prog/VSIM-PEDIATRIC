import * as THREE from "three";

export interface IKTarget {
  position: THREE.Vector3;
}

export class NurseIKController {
  private target = new THREE.Vector3();

  setTarget(target: IKTarget): void {
    this.target.copy(target.position);
  }

  update(nurseRoot: THREE.Object3D, deltaSeconds: number): void {
    // Stable procedural approximation for the first production milestone.
    // A validated skeletal IK rig can replace this without changing the API.
    const alpha = Math.max(0, Math.min(1, deltaSeconds * 8));
    nurseRoot.position.lerp(
      new THREE.Vector3(this.target.x * 0.02, nurseRoot.position.y, this.target.z * 0.02),
      alpha,
    );
  }
}
