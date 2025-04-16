import { Assets, AnimatedSprite, Texture, Rectangle } from 'pixi.js';

export enum CharacterState {
  STAY = 'stay',
  MOVING = 'moving',
  CROSSED = 'success',
  FALLING = 'falling',
}

export default class Character extends AnimatedSprite {
  state: CharacterState | undefined;
  distance: number = 0;
  targetDistance: number = 200;
  speed: number = 3;

  constructor() {
    super([Texture.EMPTY]);
    this.init();
  }

  async init() {
    const charSheet = await Assets.load('char.png');
    const charSprites: Texture[] = [];

    for (let i = 0; i < 6; i++) {
      const x = i * 32; // 32 px
      const y = 0;
      const frame = new Rectangle(x, y, 32, 32);

      charSprites.push(
        new Texture({
          source: charSheet.source,
          frame,
        })
      );
    }

    this.textures = charSprites;
    this.animationSpeed = 0.15;
    this.scale.set(2, 2);
    this.loop = true;
    this.state = CharacterState.STAY;
  }

  move(deltaTime: number) {
    this.x += this.speed * deltaTime;
    this.distance += this.speed * deltaTime;
  }
}
