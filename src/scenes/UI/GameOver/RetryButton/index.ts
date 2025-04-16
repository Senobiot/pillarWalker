import { Container, Graphics, Text } from 'pixi.js';
import { COLORS, skewStyle } from '../../../../styles';

export default class RetryButton extends Container {
  button: Graphics;
  buttonText: Text;

  constructor() {
    super();
    this.button = new Graphics();
    this.buttonText = new Text({ text: 'RETRY', style: skewStyle });
    this.init();
  }

  init = () => {
    this.button.roundRect(-100, -35, 200, 70, 8);
    this.button.fill(COLORS.forestGreen);
    this.button.stroke({ width: 8, color: '#004620' });

    this.buttonText.anchor.set(0.45, 0.5);
    this.buttonText.position.set(0, 0);

    this.addChild(this.button);
    this.addChild(this.buttonText);

    this.interactive = true;
    this.cursor = 'pointer';

    this.on('mouseover', () => {
      this.button
        .roundRect(-100, -35, 200, 70, 8)
        .fill(COLORS.darkGreen)
        .stroke({ width: 4, color: '#004620' });
    });

    this.on('mouseout', () => {
      this.button
        .roundRect(-100, -35, 200, 70, 8)
        .fill(COLORS.forestGreen)
        .stroke({ width: 8, color: '#004620' });
    });
  };

  onRetry = (callback: CallableFunction) => {
    this.on('pointerdown', () => {
      callback();
    });
  };
}
