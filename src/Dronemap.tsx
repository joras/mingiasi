import { useRef, useState, useEffect } from "react";
import "./Dronemap.css";
import { DroneFlags, DroneSimUI } from "./DroneSimUI";
import { ThreeJSOverlayView } from "./external/threejs-map";
import { CircleDrone } from "./simulation/CircleDrone";
import { TriangleDrone } from "./simulation/TriangleDrone";
import { SquareDrone } from "./simulation/SquareDrone";
import {
  getRandomPointInEstonia,
  getRandomPointOnEarth,
  kmhToMs,
} from "./util";
import { SimulationOverlayController } from "./SimulationSceneController";

const mapOptions = {
  mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
  center: { lat: 59.437, lng: 24.7536 },
  zoom: 8,
  disableDefaultUI: true,
  heading: 0,
  tilt: 0,
};

function createDroneMapController(
  map: google.maps.Map,
  popupDiv: HTMLDivElement
) {
  console.log(mapOptions);
  const overlay = new ThreeJSOverlayView({
    map,
    upAxis: "Y",
    anchor: mapOptions.center,
  });

  const controller = new SimulationOverlayController(overlay, popupDiv);

  const animate = () => {
    controller.update(overlay);
    overlay.requestRedraw();
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);

  return controller;
}

export function DroneMap() {
  const controllerRef = useRef<SimulationOverlayController>();
  const [map, setMap] = useState<google.maps.Map>();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const labelRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      controllerRef.current !== undefined ||
      mapDivRef.current === null ||
      labelRootRef.current === null
    ) {
      return;
    }

    const mapDiv = mapDivRef.current;
    const mapInstance = new window.google.maps.Map(mapDiv, mapOptions);
    setMap(mapInstance);

    controllerRef.current = createDroneMapController(
      mapInstance,
      labelRootRef.current
    );
  }, []);

  function createDrones(types: DroneFlags, amount: number) {
    if (!controllerRef.current || amount == 0) {
      return;
    }

    if (types.circle) {
      for (let i = 0; i < amount; i++) {
        controllerRef.current.addDrone(
          new CircleDrone(
            getRandomPointInEstonia(),
            10000 + Math.random() * 20000,
            kmhToMs(110 + Math.random() * 290)
          )
        );
      }
    }

    if (types.square) {
      for (let i = 0; i < amount; i++) {
        controllerRef.current.addDrone(
          new SquareDrone(
            getRandomPointInEstonia(),
            getRandomPointOnEarth(),
            kmhToMs(50 + Math.random() * 30)
          )
        );
      }
    }

    if (types.triangle) {
      for (let i = 0; i < amount; i++) {
        controllerRef.current.addDrone(
          new TriangleDrone(
            getRandomPointInEstonia(),
            getRandomPointOnEarth(),
            kmhToMs(1700 + Math.random() * 500)
          )
        );
      }
    }
  }

  function setFilter(types: DroneFlags) {
    controllerRef.current?.setFilter(types);
  }

  return (
    <>
      <div ref={mapDivRef} id="map" />
      <div
        ref={labelRootRef}
        className="absolute w-full h-full top-0 left-0 pointer-events-none overflow-hidden"
      ></div>
      {map ? (
        <DroneSimUI onCreateDrones={createDrones} onFilterChange={setFilter} />
      ) : null}
    </>
  );
}
