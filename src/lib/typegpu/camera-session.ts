import { d } from 'typegpu';

export interface DepthCameraFrame {
  readonly source: HTMLVideoElement | VideoFrame;
  readonly uvTransform: d.m2x2f;
  readonly swapAxes: boolean;
}
