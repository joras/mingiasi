import { BoxGeometry, Mesh, MeshBasicMaterial, Vector2, Vector3 } from "three";
import { ShortestPathDroneQuaternion } from "./ShortestPathDroneQuaternion";
import { EARTH_RADIUS_M, latLngToVector3 } from "./utils";
import { DroneType } from "../types";

export class SquareDrone extends ShortestPathDroneQuaternion {
  speed: number;
  ttl: number;
  type: DroneType;

  constructor(startLocation: Vector2, pointToPass: Vector2, speedMS: number) {
    const greatCircleAxis = new Vector3().crossVectors(
      latLngToVector3(startLocation),
      latLngToVector3(pointToPass),
    ).normalize();

    const angularSpeed = speedMS / EARTH_RADIUS_M;
    super(latLngToVector3(startLocation), greatCircleAxis, angularSpeed);
    this.ttl = Infinity;
    this.speed = speedMS;
    this.type = "square";
  }

  getMesh() {
    const geometry = new BoxGeometry(1000, 1000, 1000);
    const material = new MeshBasicMaterial({ color: 0xaaaaff });
    return new Mesh(geometry, material);
  }
}
