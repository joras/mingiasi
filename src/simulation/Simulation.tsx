import { Drone } from "./Drone";

export class Simulation {
  drones: Drone[];

  constructor() {
    this.drones = [];
  }

  addDrone(drone: Drone) {
    this.drones.push(drone);
  }

  update(deltaSecs: number) {
    for (const drone of this.drones) {
      drone.updateLocation(deltaSecs);
    }

    // remove non-active drones
    this.drones = this.drones.filter((drone) => drone.isActive);
  }
}
