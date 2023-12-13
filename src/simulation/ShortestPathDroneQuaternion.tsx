import { Quaternion, Vector2, Vector3 } from "three";
import { vector3ToLatLng } from "./utils";
import { generateUUID } from "three/src/math/MathUtils.js";

export abstract class ShortestPathDroneQuaternion {
  isActive: boolean;
  id: string;
  location: Vector2;

  private rotationAxis: Vector3;
  private rotation: Quaternion;
  private sphereLocation: Vector3;
  private angularSpeed: number;

  protected totalAngle: number;
  protected totalTime: number;

  constructor(startLocation: Vector3, axis: Vector3, angularSpeed: number) {
    this.id = generateUUID();
    this.isActive = true;
    this.sphereLocation = startLocation;
    this.location = vector3ToLatLng(this.sphereLocation);
    this.rotationAxis = axis;
    this.rotation = new Quaternion();
    this.angularSpeed = angularSpeed;
    this.totalAngle = 0;
    this.totalTime = 0;
  }

  updateLocation(timeDelta: number) {
    if (!this.isActive) {
      return;
    }

    const amountToRotate = this.angularSpeed * timeDelta;
    this.totalAngle += amountToRotate;

    this.rotation.setFromAxisAngle(this.rotationAxis, amountToRotate);
    this.rotation.normalize();

    this.sphereLocation.applyQuaternion(this.rotation);
    this.location = vector3ToLatLng(this.sphereLocation);

    this.totalTime += timeDelta;
  }
}
