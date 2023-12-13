import {
  BufferGeometry,
  Clock,
  Color,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector2,
  Vector3,
} from "three";
import { ThreeJSOverlayView } from "./external/threejs-map";
import { Simulation } from "./simulation/Simulation";
import { Drone } from "./simulation/Drone";
import { DroneFlags } from "./DroneSimUI";

const ACTIVE_COLOR = 0xffffff;
const HOVER_COLOR = 0xcccccc;

type DroneMesh = Mesh<BufferGeometry, MeshBasicMaterial> & {
  userData: {
    drone: Drone;
    originalColor?: Color;
    expanded?: boolean;
    labelDiv?: HTMLDivElement;
  };
};

export class SimulationOverlayController {
  clock: Clock;
  scene: Scene;
  simulation: Simulation;
  meshes: DroneMesh[];
  overlay: ThreeJSOverlayView;

  private highLightedDrone: DroneMesh | undefined;
  private mousePosition: Vector2;
  private popupDiv: HTMLDivElement;
  private filter: DroneFlags;

  constructor(overlay: ThreeJSOverlayView, popupDiv: HTMLDivElement) {
    this.clock = new Clock();
    this.scene = overlay.scene;
    this.overlay = overlay;
    this.simulation = new Simulation();
    this.meshes = [];
    this.mousePosition = new Vector2();
    this.popupDiv = popupDiv;
    this.filter = { circle: true, square: true, triangle: true };

    const mapDiv = this.overlay.getMap().getDiv();

    // handle click on a drone
    mapDiv.addEventListener("click", () => {
      if (this.highLightedDrone?.userData.drone) {
        this.highLightedDrone.userData.expanded =
          !this.highLightedDrone?.userData.expanded;
      }
    });

    // track mouse for raycasting
    mapDiv.addEventListener("mousemove", (ev) => {
      const { left, top, width, height } = mapDiv.getBoundingClientRect();

      const x = ev.clientX - left;
      const y = ev.clientY - top;

      this.mousePosition.x = 2 * (x / width) - 1;
      this.mousePosition.y = 1 - 2 * (y / height);
      overlay.requestRedraw();
    });

    // raycast
    overlay.onBeforeDraw = () => {
      const intersections = overlay.raycast(this.mousePosition, this.meshes, {
        recursive: false,
      });

      // reset color
      if (
        this.highLightedDrone &&
        this.highLightedDrone.userData.originalColor
      ) {
        this.highLightedDrone.material.color =
          this.highLightedDrone.userData.originalColor;
        this.highLightedDrone.userData.originalColor = undefined;
      }

      if (intersections.length === 0) {
        this.overlay.getMap().setOptions({ draggableCursor: null });
        this.highLightedDrone = undefined;
        return;
      }

      this.highLightedDrone = intersections[0].object;
      this.highLightedDrone.userData.originalColor =
        this.highLightedDrone.material.color.clone();

      this.highLightedDrone.material.color.setHex(HOVER_COLOR);

      this.overlay.getMap().setOptions({ draggableCursor: "pointer" });
    };
  }

  private getDroneMesh(drone: Drone) {
    return drone.getMesh();
  }

  addDrone(drone: Drone) {
    this.simulation.addDrone(drone);
    const mesh = this.getDroneMesh(drone) as DroneMesh;
    mesh.userData = { drone };
    this.meshes.push(mesh);
    this.scene.add(mesh);
  }

  setFilter(droneFilter: DroneFlags) {
    this.filter = droneFilter;
  }

  update(overlay: ThreeJSOverlayView) {
    const delta = this.clock.getDelta();
    this.simulation.update(delta);

    // update meshes after simulation
    this.meshes.map((droneMesh) => {
      const drone = droneMesh.userData.drone;

      // apply filter
      droneMesh.visible = this.filter[drone.type] === true;

      if (!drone.isActive) {
        this.scene.remove(droneMesh);

        if (droneMesh.userData.labelDiv) {
          this.popupDiv.removeChild(droneMesh.userData.labelDiv);
          droneMesh.userData.labelDiv = undefined;
        }

        return;
      }

      // update scene location
      overlay.latLngAltitudeToVector3(
        { lat: drone.location.x, lng: drone.location.y },
        droneMesh.position
      );

      // update 2d labels
      this.updateLabels(droneMesh);
    });

    // delete drone from the controller
    this.meshes = this.meshes.filter((mesh) => mesh.userData.drone.isActive);
  }

  updateLabels(droneMesh: DroneMesh) {
    const expanded = droneMesh.userData.expanded;
    const drone = droneMesh.userData.drone;

    if (!expanded) {
      if (droneMesh.userData.labelDiv) {
        this.popupDiv.removeChild(droneMesh.userData.labelDiv);
        droneMesh.userData.labelDiv = undefined;
      }

      if (droneMesh.userData.originalColor) {
        droneMesh.material.color = droneMesh.userData.originalColor;
        droneMesh.userData.originalColor = undefined;
      }

      return;
    }

    // set active color
    droneMesh.userData.originalColor = droneMesh.material.color.clone();
    droneMesh.material.color.setHex(ACTIVE_COLOR);

    if (!droneMesh.userData.labelDiv) {
      droneMesh.userData.labelDiv = document.createElement("div");
      this.popupDiv.appendChild(droneMesh.userData.labelDiv);
    }

    droneMesh.userData.labelDiv.innerHTML = this.droneHTML(drone);
    if (!droneMesh.userData.labelDiv.parentNode) {
      this.popupDiv.appendChild(droneMesh.userData.labelDiv);
    }

    // todo: reuse
    const viewProjectionMatrix = new Matrix4();
    const viewMatrix = this.overlay.camera.matrixWorldInverse.clone();
    viewProjectionMatrix.multiplyMatrices(
      this.overlay.camera.projectionMatrix,
      viewMatrix
    );

    const vector = new Vector3();
    vector.setFromMatrixPosition(droneMesh.matrixWorld);
    vector.applyMatrix4(viewProjectionMatrix);
    const halfWidth = this.popupDiv.clientWidth / 2;
    const halfHeight = this.popupDiv.clientHeight / 2;

    droneMesh.userData.labelDiv.style.transform = `
         translate(${vector.x * halfWidth + halfWidth}px, ${
      -vector.y * halfHeight + halfHeight
    }px)`;
  }

  private droneHTML(drone: Drone) {
    return `
    <div class="border dark flex p-2 absolute flex-col rounded-l bg-gray-800 font-mono text-sm">
      <table>
        <tr>
          <td class="font-bold">Speed</td>
          <td class="font-normal">${(drone.speed * 3.6).toFixed(2)}km/h</td>
        </tr>
        <tr>
          <td class="font-bold">Location</td>
          <td class="font-normal">
            (${drone.location.x.toFixed(6)};${drone.location.y.toFixed(6)})
          </td>
        </tr>
        ${
          drone.ttl
            ? `<tr>
        <td class="font-bold">TTL</td>
        <td class="font-normal">${drone.ttl?.toFixed(1)} seconds </td>
      </tr>`
            : ""
        }
      </table>
    </div>`;
  }
}
