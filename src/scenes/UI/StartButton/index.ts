import { BitmapText, Graphics, Container, Circle } from 'pixi.js';
import { AppSizeProps } from '../../../app/App';

export default class StartButton extends Container {
  button: Graphics;
  buttonText: BitmapText;

  constructor(appSize: AppSizeProps) {
    super();
    this.button = new Graphics();
    this.buttonText = new BitmapText('Start', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '0x00FF00',
      align: 'center',
    });
    this.init(appSize);
  }

  init = (appSize: AppSizeProps) => {
    const { width, height } = appSize;

    this.button
      .circle(width / 2, height / 2, 70)
      .stroke({ width: 3, color: 0x00ff00 });
    this.button.hitArea = new Circle(width / 2, height / 2, 70);
    this.button.interactive = true;
    this.button.cursor = 'pointer';
    this.buttonText.anchor.set(0.5);
    this.buttonText.x = width / 2;
    this.buttonText.y = height / 2;

    this.addChild(this.button);
    this.addChild(this.buttonText);
  };

  onStart = (callback: CallableFunction) => {
    this.button.on('pointerdown', () => {
      callback();
    });
  };
}
