import { Text, Graphics, Container } from 'pixi.js';
import { COLORS, smallStyle } from '~/styles';
import { SizeProps } from '~/types';

export default class SelectButton extends Container {
  button: Graphics;
  buttonText: Text;

  constructor(appSize: SizeProps) {
    super();
    this.button = new Graphics();
    this.buttonText = new Text({
      text: 'Select character',
      style: smallStyle,
    });

    this.init(appSize);
  }
  init = (appSize: SizeProps) => {
    const { width, height } = appSize;

    this.button
      .roundRect(0, 0, 200, 60, 6)
      .fill({ color: COLORS.desert, alpha: 0 })
      .stroke({ width: 6, color: COLORS.desertDark });

    this.buttonText.anchor.set(0.5);
    this.buttonText.x = this.button.width / 2;
    this.buttonText.y = this.button.height / 2;

    this.button.addChild(this.buttonText);
    this.button.interactive = true;
    this.button.cursor = 'pointer';

    this.button.x = width / 2 - 100;
    this.button.y = height / 2 + 100;

    this.addChild(this.button);

    this.button.on('mouseover', () => {
      this.button
        .clear()
        .roundRect(0, 0, 200, 60, 6)
        .fill({ color: COLORS.desert, alpha: 0.75 })
        .stroke({ width: 6, color: COLORS.desertDark });
    });

    this.button.on('mouseout', () => {
      this.button;
      this.button
        .clear()
        .roundRect(0, 0, 200, 60, 6)
        .fill({ color: COLORS.desert, alpha: 0 })
        .stroke({ width: 6, color: COLORS.desertDark });
    });
  };

  onStart = (callback: CallableFunction) => {
    this.button.on('pointerdown', () => {
      callback();
    });
  };
}
