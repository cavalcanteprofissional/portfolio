import { LIGHT_Z_MIN, LIGHT_Z_MAX } from './renderer';

const ORBIT_SPEED = 0.00024;
const ORBIT_RADIUS = 0.26;
const WHEEL_SENSITIVITY = 0.0004;
const LERP = 0.12;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export interface LightController {
  readonly lightPosition: [number, number];
  readonly lightZ: number;
  updateFromMouse(mouseX: number, mouseY: number): void;
  updateFromWheel(deltaY: number): void;
  orbitTick(): void;
  tick(): void;
}

export function createLightController(
  initialPosition: [number, number] = [0.34, 0.34],
  initialZ: number = -0.2,
): LightController {
  let lightPosition: [number, number] = [...initialPosition];
  let lightZ = initialZ;
  let targetPosition: [number, number] = [...initialPosition];
  let targetZ = initialZ;

  return {
    get lightPosition() {
      return lightPosition;
    },
    get lightZ() {
      return lightZ;
    },
    updateFromMouse(mouseX: number, mouseY: number) {
      targetPosition = [clamp(mouseX, 0, 1), clamp(mouseY, 0, 1)];
    },
    updateFromWheel(deltaY: number) {
      targetZ = clamp(targetZ + deltaY * WHEEL_SENSITIVITY, LIGHT_Z_MIN, LIGHT_Z_MAX);
    },
    orbitTick() {
      const phase = performance.now() * ORBIT_SPEED;
      targetPosition = [
        0.5 + Math.cos(phase) * ORBIT_RADIUS,
        0.44 + Math.sin(phase * 1.37) * ORBIT_RADIUS * 0.8,
      ];
    },
    tick() {
      lightPosition = [
        lerp(lightPosition[0], targetPosition[0], LERP),
        lerp(lightPosition[1], targetPosition[1], LERP),
      ];
      lightZ = lerp(lightZ, targetZ, LERP);
    },
  };
}
