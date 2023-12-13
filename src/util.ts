import { Vector2 } from "three";

const ESTONIA_BOUNDS = {
  lng1: 23.3397953631,
  lat1: 57.4745283067,
  lng2: 28.1316992531,
  lat2: 59.6110903998,
};

export function getRandomPointInEstonia() {
  return new Vector2(
    ESTONIA_BOUNDS.lat1 + Math.random() * (ESTONIA_BOUNDS.lat2 -
          ESTONIA_BOUNDS.lat1),
    ESTONIA_BOUNDS.lng1 + Math.random() * (ESTONIA_BOUNDS.lng2 -
          ESTONIA_BOUNDS.lng1),
  );
}

export function getRandomPointOnEarth() {
  return new Vector2((Math.random() * 180) - 90, (Math.random() * 360) - 180);
}

export function kmhToMs(speedInKmh: number) {
  return 0.2778 * speedInKmh;
}
