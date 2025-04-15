import { Assets, AnimatedSprite, Container, Texture, Rectangle } from 'pixi.js';

export default class Character extends Container {
  charSprites: Texture[];
  animation: AnimatedSprite | undefined;
  distance: any;
  targetDistance: any;
  constructor() {
    super();
    this.charSprites = [];
    this.init();
  }

  async init() {
    const charSheet = await Assets.load('char.png');

    for (let i = 0; i < 6; i++) {
      const x = i * 32; // 32 px
      const y = 0;
      const frame = new Rectangle(x, y, 32, 32);

      this.charSprites.push(
        new Texture({
          source: charSheet.source,
          frame,
        })
      );
    }

    this.animation = new AnimatedSprite(this.charSprites);
    this.animation.animationSpeed = 0.15;
    this.animation.scale.set(2, 2);
    this.animation.loop = true;
    this.addChild(this.animation);
  }

  move = (deltaTime: number) => {
    if (this.animation && this.distance < this.targetDistance) {
      const speed = 5;
      this.animation.x += speed * deltaTime;
      this.distance += speed * deltaTime;
    }
  };
}
