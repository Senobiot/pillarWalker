import { Graphics } from 'pixi.js';

export default class PillarsFabric {
  defaultX: number = 100;
  pillarY: number = 300;
  pillarHeight: number = 300;
  previousPosition: number;

  constructor() {
    this.previousPosition = 0;
  }

  createPillar(): Graphics {
    const minGap = 50;
    const maxGap = 150;
    const randomGap =
      minGap + Math.floor(Math.random() * (maxGap - minGap + 1));

    const minWidth = 40;
    const maxWidth = 80;
    const randomWidth =
      minWidth + Math.floor(Math.random() * (maxWidth - minWidth + 1));
    const currentX = this.previousPosition
      ? this.previousPosition + randomGap
      : this.defaultX;

    const pillar = new Graphics();
    pillar.beginFill(0x8b4513);
    pillar.drawRect(currentX, this.pillarY, randomWidth, this.pillarHeight);
    pillar.endFill();

    this.previousPosition = currentX + randomWidth;

    return pillar;
  }
}
