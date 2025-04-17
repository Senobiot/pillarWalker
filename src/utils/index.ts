import { InBoundsProps } from '../types';

export const getScreenSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const getRandInBounds = (props: InBoundsProps): number => {
  const startRange = props.minX;
  const endRange = props.maxX - props.width;

  if (startRange > endRange) {
    return 0;
  }

  return Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
};

export const getChance = (probability: number): boolean => {
  if (probability < 0 || probability > 1) {
    return false;
  }

  return Math.random() < probability;
};
