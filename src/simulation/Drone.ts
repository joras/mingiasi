import { Mesh, Vector2 } from "three";
import { DroneType } from "../types";

export interface Drone {
  updateLocation(timerDelta: number): void;
  getMesh(): Mesh;
  location: Vector2;
  id: string;
  isActive: boolean;
  ttl?: number;
  speed: number;
  type: DroneType;
}
