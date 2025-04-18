import { Assets, AnimatedSprite, Texture, Container, Graphics } from 'pixi.js';
import { COLORS } from '~/styles';
import { SizeProps } from '~/types';
import { assetsConfig } from '~/config/';

export default class SelectScreen extends Container {
  animationSpeed: number = 3;
  character: AnimatedSprite = new AnimatedSprite([Texture.EMPTY]);
  appSize: SizeProps;
  rightArrow: Graphics;
  leftArrow: Graphics;
  charactersConfig: any;
  characterIndex: number;
  charactersAmount: number;

  constructor(appSize: SizeProps) {
    super();
    this.charactersConfig = assetsConfig.characters;
    this.charactersAmount = this.charactersConfig.length - 1;
    this.characterIndex = 0;
    this.appSize = appSize;
    this.rightArrow = this.drawArrow(
      appSize.width / 2 + 130,
      appSize.height / 2
    );
    this.leftArrow = this.drawArrow(
      appSize.width / 2 - 130,
      appSize.height / 2,
      true
    );

    this.addChild(this.drawBackGround());
    this.addChild(this.leftArrow);
    this.addChild(this.rightArrow);
    this.initCharacter();
    this.visible = false;
  }

  async initCharacter() {
    const textures = [];

    const config = this.charactersConfig[this.characterIndex];

    for (let index = 1; index <= config.idle.amount; index++) {
      const asset = await Assets.load(`${config.idle.url}${index}.png`);
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
      console.log(this.characterIndex);
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
