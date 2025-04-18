import { Assets, AnimatedSprite, Texture, Container, Graphics } from 'pixi.js';
import { COLORS, smallStyle } from '~/styles';
import { SizeProps } from '~/types';
import { assetsConfig } from '~/config';
import Button from '~/entities/Button';

export default class SelectScreen extends Container {
  animationSpeed: number = 3;
  character: AnimatedSprite = new AnimatedSprite([Texture.EMPTY]);
  appSize: SizeProps;
  rightArrow: Graphics;
  leftArrow: Graphics;
  charactersConfig: any;
  characterIndex: number;
  charactersAmount: number;
  confirmButton: Button;
  textures: Texture[] = [Texture.EMPTY];
  texturesRun: Texture[] = [Texture.EMPTY];

  constructor(appSize: SizeProps) {
    super();
    const { width, height } = appSize;

    this.charactersConfig = assetsConfig.characters;
    this.charactersAmount = this.charactersConfig.length - 1;
    this.characterIndex = 0;
    this.appSize = appSize;
    this.rightArrow = this.drawArrow(width / 2 + 130, height / 2);
    this.leftArrow = this.drawArrow(width / 2 - 130, height / 2, true);

    this.confirmButton = new Button({
      size: { width: 140, height: 40 },
      variant: 'roundRect',
      text: 'CONFIRM',
      textStyle: smallStyle,
      position: { x: width / 2, y: height / 2 + 125 },
    });

    this.addChild(this.drawBackGround());
    this.addChild(this.leftArrow);
    this.addChild(this.rightArrow);
    this.addChild(this.confirmButton);

    this.initCharacter();
    this.visible = false;
  }

  async initCharacter() {
    this.textures = [];
    this.texturesRun = [];

    const config = this.charactersConfig[this.characterIndex];

    for (let index = 1; index <= config.idle.amount; index++) {
      const asset = await Assets.load(`${config.idle.url}${index}.png`);
      this.textures.push(new Texture({ source: asset.source }));
    }

    for (let index = 1; index <= config.run.amount; index++) {
      const asset = await Assets.load(`${config.run.url}${index}.png`);
      this.texturesRun.push(new Texture({ source: asset.source }));
    }

    if (this.character) {
      this.removeChild(this.character);
      this.character.destroy();
    }

    this.character = new AnimatedSprite(this.textures);
    this.character.animationSpeed = 0.15;
    this.character.loop = true;
    this.character.scale.set(2);
    this.character.x = this.appSize.width / 2 - this.character.width / 2;
    this.character.y = this.appSize.height / 2 - this.character.height / 2;

    this.character.play();
    this.addChild(this.character);
  }

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

    arrow.on('pointerdown', () => {
      if (rotated) {
        this.characterIndex < 1
          ? (this.characterIndex = this.charactersAmount)
          : --this.characterIndex;
        return this.initCharacter();
      }

      this.characterIndex =
        this.characterIndex === this.charactersAmount
          ? (this.characterIndex = 0)
          : ++this.characterIndex;

      this.initCharacter();
    });

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
