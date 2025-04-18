import { Text, Graphics, Container } from 'pixi.js';
import { COLORS, regularStyle } from '~/styles';
import { ColorsProps, ButtonSizeProps, ButtonProps } from '~/types';

export default class Button extends Container {
  button: Graphics;
  buttonText: Text;
  size: ButtonSizeProps;
  variant: 'circle' | 'rect' | 'roundRect';
  colors: ColorsProps;
  noHover?: boolean;

  constructor(props: ButtonProps) {
    super();
    const {
      size = { width: 200, height: 100 },
      position,
      variant = 'roundRect',
      text,
      textStyle = regularStyle,
      colors = {
        fillColor: COLORS.desert,
        strokeColor: COLORS.desertDark,
        alpha: 0.75,
        strokeWidth: 6,
      },
      noHover = false,
    } = props;

    this.size = size;
    this.position = position;
    this.variant = variant;
    this.colors = colors;

    this.button = new Graphics();
    this.buttonText = new Text({
      text,
      style: textStyle,
    });
    this.noHover = noHover;

    this.init();
  }
  init = () => {
    const { x, y } = this.position;
    const {
      width = 200,
      height = 60,
      borderRadius,
      circleRadius = 60,
    } = this.size;
    const { fillColor, alpha, strokeWidth, strokeColor } = this.colors;

    this.x = x;
    this.y = y;

    if (this.variant === 'rect') {
      this.button.rect(0, 0, width, height);
      this.button.position.set(-width / 2, -height / 2);
    }

    if (this.variant === 'roundRect') {
      this.button.roundRect(0, 0, width, height, borderRadius || 6);
      this.button.position.set(-width / 2, -height / 2);
    }

    if (this.variant === 'circle') {
      this.button.circle(0, 0, circleRadius || 80);
      this.button.position.set(-circleRadius, -circleRadius);
    }

    this.button.fill({
      color: fillColor,
      alpha: alpha,
    });

    if (this.colors.strokeWidth) {
      this.button.stroke({
        width: strokeWidth,
        color: strokeColor,
      });
    }

    this.buttonText.anchor.set(0.5);

    if (this.variant === 'circle') {
      this.buttonText.position.set(0, 0);
    } else {
      this.buttonText.position.set(width / 2, height / 2);
    }

    this.button.addChild(this.buttonText);
    this.button.interactive = true;
    this.button.cursor = 'pointer';

    this.addChild(this.button);

    if (this.noHover) return;

    this.button.on('mouseover', () => {
      this.button.clear();

      if (this.variant === 'rect') {
        this.button.rect(0, 0, width, height);
      }

      if (this.variant === 'roundRect') {
        this.button.roundRect(0, 0, width, height, borderRadius || 6);
      }

      if (this.variant === 'circle') {
        this.button.circle(0, 0, circleRadius || 80);
      }

      this.button
        .fill({ color: COLORS.desertDark, alpha: 0.75 })
        .stroke({ width: 6, color: COLORS.desert });
    });

    this.button.on('mouseout', () => {
      this.button.clear();

      if (this.variant === 'rect') {
        this.button.rect(0, 0, width, height);
      }

      if (this.variant === 'roundRect') {
        this.button.roundRect(0, 0, width, height, borderRadius || 6);
      }

      if (this.variant === 'circle') {
        this.button.circle(0, 0, circleRadius || 80);
      }

      this.button
        .fill({ color: COLORS.desert, alpha: 0.75 })
        .stroke({ width: 6, color: COLORS.desertDark });
    });
  };

  onClick = (callback: CallableFunction) => {
    this.button.on('pointerdown', () => {
      callback();
    });
  };
}
