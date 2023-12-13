import {
  Mesh,
  MeshBasicMaterial,
  TetrahedronGeometry,
  Vector2,
  Vector3,
} from "three";
import { ShortestPathDroneQuaternion } from "./ShortestPathDroneQuaternion";
import { EARTH_RADIUS_M, latLngToVector3 } from "./utils";
import { DroneType } from "../types";

export class TriangleDrone extends ShortestPathDroneQuaternion {
  ttl: number;
  speed: number;
  type: DroneType;

  constructor(startLocation: Vector2, endLocation: Vector2, speedMS: number) {
    const greatCircleAxis = new Vector3().crossVectors(
      latLngToVector3(startLocation),
      latLngToVector3(endLocation),
    );

    const angularSpeed = speedMS / EARTH_RADIUS_M;

    super(latLngToVector3(startLocation), greatCircleAxis, angularSpeed);
    this.ttl = 60 * 60;
    this.speed = speedMS;
    this.type = "triangle";
  }

  updateLocation(timeDelta: number): void {
    super.updateLocation(timeDelta);

    this.ttl -= timeDelta;
    if (this.ttl <= 0) {
      this.isActive = false;
    }
  }

  getMesh() {
    const geometry = new TetrahedronGeometry(1000, 0);
    const material = new MeshBasicMaterial({ color: 0xffaaaa });
    return new Mesh(geometry, material);
  }
}
