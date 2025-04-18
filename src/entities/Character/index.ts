import { Assets, AnimatedSprite, Texture } from 'pixi.js';
import { assetsConfig } from '~/config/';
export enum CharacterState {
  STAY = 'stay',
  MOVING = 'moving',
  CROSSED = 'success',
  FALLING = 'falling',
}

export default class Character extends AnimatedSprite {
  state: CharacterState | undefined;
  speed: number = 3;
  texturesStay: Texture[] = [];
  texturesRun: Texture[] = [];

  constructor() {
    super([Texture.EMPTY]);

    this.init();
  }

  async init() {
    console.log('character create');
    const config = assetsConfig.characters[1];

    for (let index = 1; index <= config.idle.amount; index++) {
      const asset = await Assets.load(`${config.idle.url}${index}.png`);
      this.texturesStay.push(new Texture({ source: asset.source }));
    }

    for (let index = 1; index <= config.run.amount; index++) {
      const asset = await Assets.load(`${config.run.url}${index}.png`);
      this.texturesRun.push(new Texture({ source: asset.source }));
    }

    this.loop = true;
    this.width = 73;
    this.height = 93;

    this.textures = this.texturesStay;

    this.animationSpeed = 0.2;

    this.state = CharacterState.STAY;
    this.anchor.set(0.5, 1);
    this.play();
  }

  move(deltaTime: number) {
    this.x += this.speed * deltaTime;
  }

  falling(deltaTime: number) {
    this.y += this.speed * deltaTime;
  }

  flip = () => {
    this.scale.y = -this.scale.y;
    this.y += this.scale.y < 0 ? 10 : -10;
  };

  changeAnimation() {
    switch (this.state) {
      case CharacterState.MOVING:
        this.textures = this.texturesRun;
        this.play();
        break;
      case CharacterState.STAY:
      case CharacterState.CROSSED:
        this.textures = this.texturesStay;
        this.play();
        break;
      default:
        break;
    }
  }
}
