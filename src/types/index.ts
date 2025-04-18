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
