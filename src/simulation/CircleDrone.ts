import {
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";
import { ShortestPathDroneQuaternion } from "./ShortestPathDroneQuaternion";
import { EARTH_RADIUS_M, latLngToVector3 } from "./utils";
import { DroneType } from "../types";

export class CircleDrone extends ShortestPathDroneQuaternion {
  speed: number;
  type: DroneType;

  constructor(centerPosition: Vector2, radiusM: number, speedMS: number) {
    const center = latLngToVector3(centerPosition);
    const angleRadians = radiusM / EARTH_RADIUS_M;
    const circumference = 2 * Math.PI * radiusM; // needs adjusting
    const angularSpeed = (speedMS / circumference) * 2 * Math.PI;

    const rotation = new Quaternion();
    rotation.setFromAxisAngle(new Vector3(0, 1, 0), angleRadians);

    const startPoint = center.clone().applyAxisAngle(
      new Vector3(1, 0, 0),
      angleRadians,
    );

    super(startPoint, center, angularSpeed);
    this.speed = speedMS;
    this.type = "circle";
  }

  updateLocation(timeDelta: number): void {
    super.updateLocation(timeDelta);

    if (Math.abs(this.totalAngle) >= 2 * Math.PI) {
      this.isActive = false;
    }
  }

  getMesh(): Mesh {
    const geometry = new SphereGeometry(1000, 30);
    const material = new MeshBasicMaterial({ color: 0xaaffaa });
    return new Mesh(geometry, material);
  }
}
