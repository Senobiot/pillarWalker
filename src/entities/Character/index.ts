import { Assets, AnimatedSprite, Texture } from 'pixi.js';

export enum CharacterState {
  STAY = 'stay',
  MOVING = 'moving',
  CROSSED = 'success',
  FALLING = 'falling',
}

export default class Character extends AnimatedSprite {
  state: CharacterState | undefined;
  speed: number = 3;

  constructor() {
    super([Texture.EMPTY]);

    this.init();
  }

  async init() {
    console.log('character create');
    const textures = [];

    for (let index = 1; index <= 10; index++) {
      console.log(`chars/1/idle/${index}.png`);
      const asset = await Assets.load(`chars/1/idle/${index}.png`);
      textures.push(new Texture({ source: asset.source }));
    }

    this.animationSpeed = 0.15;
    this.loop = true;
    this.width = 73;
    this.height = 93;

    this.textures = textures;
    this.animationSpeed = 0.15;

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
  };
}
