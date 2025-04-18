import { TextStyle } from 'pixi.js';

export const italianoStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 40,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: '#ffffff',
  stroke: '#4a1850',
  dropShadow: true,
  wordWrap: true,
  wordWrapWidth: 440,
  align: 'center',
});

export const regularStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 40,
  fontWeight: 'bold',
  fill: '#ffffff',
  stroke: { color: 'rgba(147 126 104)', width: 8, join: 'round' },
  dropShadow: {
    alpha: 0.8,
    blur: 4,
    color: 'rgba(147 126 104)',
  },
  align: 'center',
});

export const smallStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 20,
  fontWeight: 'lighter',
  fill: '#ffffff',
  stroke: { color: 'rgba(147 126 104)', width: 8, join: 'round' },
  align: 'center',
});

export const skewStyle = new TextStyle({
  fontFamily: 'Arial',
  dropShadow: {
    alpha: 0.8,
    angle: 2.1,
    blur: 4,
    color: '0x111111',
    distance: 10,
  },
  fill: '#ffffff',
  stroke: { color: '#004620', width: 12, join: 'round' },
  fontSize: 32,
  fontWeight: 'lighter',
});

export const lightBlueStyle = {
  fontFamily: 'Arial',
  fontSize: 28,
  fill: '#53BECF',
  stroke: { color: 'rgb(50, 55, 56)', width: 4 },
};

export const COLORS = {
  green: '0x111111',
  darkGreen: '0x006400',
  lightGreen: '0x90ee90',
  forestGreen: '0x228b22',
  limeGreen: '0x32cd32',
  teal: '0x008080',
  navy: '0x000080',
  darkRed: '0x8b0000',
  crimson: '0xdc143c',
  gold: '0xffd700',
  darkBlue: '0x00008b',
  white: '0xffffff',
  black: '0x000000',
  gray: '0x808080',
  orange: '0xffa500',
  pink: '0xffc0cb',
  purple: '0x800080',
  desert: 'rgb(225 209 182)',
  desertDark: 'rgba(147 126 104)',
};
