import { Text, Graphics, Container, Circle } from 'pixi.js';
import { AppSizeProps } from '../../../app/App';
import { COLORS, skewStyle } from '../../../styles';

export default class StartButton extends Container {
  button: Graphics;
  buttonText: Text;

  constructor(appSize: AppSizeProps) {
    super();
    this.button = new Graphics();
    this.buttonText = new Text({ text: 'RETRY', style: skewStyle });
    this.init(appSize);
  }

  init = (appSize: AppSizeProps) => {
    const { width, height } = appSize;

    this.button
      .circle(width / 2, height / 2, 80)
      .fill(COLORS.forestGreen)
      .stroke({ width: 8, color: '#004620' });
    this.button.hitArea = new Circle(width / 2, height / 2, 80);
    this.button.interactive = true;
    this.button.cursor = 'pointer';
    this.buttonText.anchor.set(0.45, 0.5);
    this.buttonText.x = width / 2;
    this.buttonText.y = height / 2;

    this.addChild(this.button);
    this.addChild(this.buttonText);

    this.button.on('mouseover', () => {
      this.button
        .circle(width / 2, height / 2, 80)
        .fill(COLORS.darkGreen)
        .stroke({ width: 4, color: '#004620' });
    });

    this.button.on('mouseout', () => {
      this.button
        .circle(width / 2, height / 2, 80)
        .fill(COLORS.forestGreen)
        .stroke({ width: 8, color: '#004620' });
    });
  };

  onStart = (callback: CallableFunction) => {
    this.button.on('pointerdown', () => {
      callback();
    });
  };
}
