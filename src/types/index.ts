import { TextStyle } from 'pixi.js';

export type SizeProps = {
  width: number;
  height: number;
  borderRadius?: number;
  scaleFactor?: number;
};

export type ButtonSizeProps = {
  width?: number;
  height?: number;
  borderRadius?: number;
  circleRadius?: number;
};

export type PositionProps = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type ColorsProps = {
  fillColor: string;
  strokeColor: string;
  alpha: number;
  strokeWidth: number;
};

export type InBoundsProps = {
  minX: number;
  maxX: number;
  width: number;
};

export type CounterProps = {
  initialText?: string;
  initial?: number;
  position?: PositionProps;
  style?: TextStyle;
};

export enum GameState {
  ACTIVE = 'active',
  PAUSED = 'paused',
  MENU = 'menu',
  OVER = 'over',
  STARTING = 'starting',
}

export enum TouchScren {
  HOLDING = 'holding',
  TAP = 'tap',
  CLEAR = 'clear',
}

export enum CharacterState {
  STAY = 'stay',
  MOVING = 'moving',
  CROSSED = 'success',
  FALLING = 'falling',
}

export enum BridgeState {
  ROTATING = 'rotating',
  DROPPED = 'dropped',
  FOLDING = 'folding',
  COLLAPSED = 'collapsed',
  CROSSED = 'crossed',
  GROWING = 'growing',
  CREATING = 'creating',
}

export enum BridgeOutfits {
  LESSER = 'less',
  LARGER = 'larger',
  EXACT = 'exact',
  NEAR = 'near',
}

export type ButtonProps = {
  size?: ButtonSizeProps;
  position: PositionProps;
  text: string;
  textStyle?: TextStyle;
  variant?: 'circle' | 'rect' | 'roundRect';
  colors?: ColorsProps;
  noHover?: boolean;
};
