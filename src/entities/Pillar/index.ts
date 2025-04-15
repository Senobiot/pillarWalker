import { Graphics } from 'pixi.js';
import { AppSizeProps } from '../../app/App';

export default class PillarsFabric {
  defaultX: number = 60;
  pillarY: number = 300;
  pillarHeight: number = 170;
  previousPosition: number;
  bridge: Graphics | null = null;
  isDropping: boolean = false;

  constructor(appSize: AppSizeProps) {
    this.previousPosition = 0;
    this.pillarY = appSize?.height - this.pillarHeight;
  }

  create(): Graphics {
    const minGap = 50;
    const maxGap = 150;
    const randomGap =
      minGap + Math.floor(Math.random() * (maxGap - minGap + 1));

    const minWidth = 50;
    const maxWidth = 150;
    const randomWidth =
      minWidth + Math.floor(Math.random() * (maxWidth - minWidth + 1));
    const currentX = this.previousPosition
      ? this.previousPosition + randomGap
      : this.defaultX;

    const pillar = new Graphics();
    pillar.beginFill(0x000000);
    pillar.drawRect(currentX, this.pillarY, randomWidth, this.pillarHeight);
    pillar.endFill();

    this.previousPosition = currentX + randomWidth;

    return pillar;
  }

  createBridge(
    x: number = this.previousPosition,
    y: number = this.pillarY
  ): Graphics {
    this.bridge = new Graphics();
    const width = 5;
    const initialHeight = 1;

    this.bridge.beginFill(0x000000);
    this.bridge.drawRect(0, 0, width, initialHeight);
    this.bridge.endFill();

    this.bridge.x = x - width;
    this.bridge.y = y;

    return this.bridge;
  }

  growBridge(delta: number) {
    if (this.bridge) {
      this.bridge.scale.y -= delta * 300;
    }
  }
  dropBridge(delta: number) {
    if (this.bridge) {
      if (this.bridge.rotation < Math.PI / 2) {
        this.bridge.rotation += delta * 2;
        if (this.bridge.rotation >= Math.PI / 2) {
          this.isDropping = false;
          this.bridge.rotation = Math.PI / 2;
        }
      }
    }
  }
}
