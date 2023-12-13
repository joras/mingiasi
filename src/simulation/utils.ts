import { MathUtils, Vector2, Vector3 } from "three";

export const EARTH_RADIUS_M = 6371000;
export const EARTH_CIRCUMFERENCE = EARTH_RADIUS_M * 2 * Math.PI;

export function latLngToVector3(location: Vector2): Vector3 {
  // Convert latitude and longitude from degrees to radians
  const phi = MathUtils.degToRad(90 - location.x); // phi is the polar angle measured from the north pole (90 - lat)
  const theta = MathUtils.degToRad(location.y); // theta is the azimuthal angle measured from the positive x-axis

  // Convert spherical coordinates to Cartesian coordinates
  const x = 1 * Math.sin(phi) * Math.cos(theta);
  const y = 1 * Math.cos(phi);
  const z = 1 * Math.sin(phi) * Math.sin(theta);

  const vec = new Vector3(x, y, z);

  return vec;
}

export function vector3ToLatLng(vec: THREE.Vector3): Vector2 {
  // Assuming vec is normalized (points to the surface of a unit sphere)
  const normalizedVec = vec.clone().normalize();

  // Calculate latitude (phi) and longitude (theta)
  const phi = Math.acos(normalizedVec.y); // phi is angle from the positive y-axis
  const theta = Math.atan2(normalizedVec.z, normalizedVec.x); // theta is angle from the positive x-axis on the x-z plane

  // Convert phi and theta from radians to degrees
  const latitude = 90 - MathUtils.radToDeg(phi); // latitude is 90 degrees minus phi
  const longitude = MathUtils.radToDeg(theta); // longitude is theta in degrees

  return new Vector2(
    latitude,
    longitude,
  );
}
