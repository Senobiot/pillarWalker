import { Assets, AnimatedSprite, Texture, Container, Graphics } from 'pixi.js';
import { COLORS } from '~/styles';
import { SizeProps } from '~/types';

export default class SelectScreen extends Container {
  animationSpeed: number = 3;
  character: AnimatedSprite = new AnimatedSprite([Texture.EMPTY]);
  appSize: SizeProps;
  background: Graphics;
  rightArrow: Graphics;
  leftArrow: Graphics;

  constructor(appSize: SizeProps) {
    super();
    this.appSize = appSize;
    this.init();
    this.rightArrow = this.drawArrow(
      appSize.width / 2 + 130,
      appSize.height / 2
    );
    this.leftArrow = this.drawArrow(
      appSize.width / 2 - 130,
      appSize.height / 2,
      true
    );
    this.background = this.drawBackGround();
  }

  async init() {
    const textures = [];

    for (let index = 1; index <= 6; index++) {
      console.log(`Idle/${index}.png`);
      const asset = await Assets.load(`chars/2/idle/${index}.png`);
      textures.push(new Texture({ source: asset.source }));
    }

    if (this.character) {
      this.removeChild(this.character);
      this.character.destroy();
    }

    this.character = new AnimatedSprite(textures);
    this.character.animationSpeed = 0.15;
    this.character.loop = true;
    this.character.width = 100;
    this.character.height = 120;
    this.character.x = this.appSize.width / 2 - this.character.width / 2;
    this.character.y = this.appSize.height / 2 - this.character.height / 2;

    this.character.play();
  }
  show = () => {
    this.addChild(this.background);
    this.addChild(this.character);
    this.addChild(this.leftArrow);
    this.addChild(this.rightArrow);
  };

  hide = () => {
    this.removeChild(this.character);
  };

  drawArrow = (x: number, y: number, rotated?: boolean) => {
    const arrow = new Graphics();
    arrow
      .fill(COLORS.desert)
      .moveTo(0, 0)
      .lineTo(-20, 10)
      .lineTo(-20, -10)
      .lineTo(0, 0)
      .fill();

    arrow.x = x;
    arrow.y = y;
    arrow.scale.set(2);
    arrow.interactive = true;
    arrow.cursor = 'pointer';

    if (rotated) {
      arrow.scale.x = -Math.abs(arrow.scale.x);
    }

    return arrow;
  };

  drawBackGround = () => {
    const background = new Graphics();

    background
      .fill(0x000000)
      .rect(0, 0, this.appSize.width, this.appSize.height)
      .fill();

    background.alpha = 0.75;

    return background;
  };
}
