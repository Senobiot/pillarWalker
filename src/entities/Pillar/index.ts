import {
  Assets,
  Container,
  Graphics,
  Sprite,
  Texture,
  TilingSprite,
} from 'pixi.js';
import { BridgeOutfits, BridgeState, SizeProps } from '~/types';

export default class PillarsFabric {
  bridgeState: BridgeState | undefined;
  defaultX: number = 0;
  pillarY: number = 300;
  pillarHeight: number = 170;
  currMaxX: number = 0;
  bridge: Container | null = null;
  endOfbridge: number = 0;
  bridgePosition: number = 0;
  currMinX: number = 0;
  bridgeOutFits: BridgeOutfits | undefined;
  triggerPlateSize: SizeProps = { width: 20, height: 5 };
  pillarsAmount: number = 0;
  texture: Texture = Assets.get('pillar-2');
  bridgeTexture = Assets.get('brick-2');
  appSize: SizeProps;
  minWidth: number;
  maxWidth: number;
  minGap: number;
  maxGap: number;
  scaleFactor: number;

  constructor(appSize: SizeProps) {
    this.pillarY = appSize?.height - this.pillarHeight;
    this.scaleFactor = appSize.scaleFactor || 1;
    this.appSize = appSize;
    this.minWidth = 80 * this.scaleFactor;
    this.maxWidth = 120 * this.scaleFactor;
    this.minGap = 80 * this.scaleFactor;
    this.maxGap = this.appSize.width - 2 * this.maxWidth;
  }

  createPillar(): Sprite {
    const randomGap =
      this.minGap + Math.floor(Math.random() * (this.maxGap - this.minGap + 1));

    const randomWidth =
      this.minWidth +
      Math.floor(Math.random() * (this.maxWidth - this.minWidth + 1));

    const currentX = this.currMaxX ? this.currMaxX + randomGap : this.defaultX;

    const pillar = new Sprite(new Texture(this.texture));
    pillar.x = currentX;
    pillar.y = this.pillarY;
    pillar.width = randomWidth;
    pillar.height = this.pillarHeight;

    this.bridgePosition = this.currMaxX;
    this.bridgeState = BridgeState.CREATING;
    this.currMaxX = currentX + randomWidth;
    this.currMinX = currentX;

    this.createTriggerPlate(pillar, randomWidth);

    this.pillarsAmount++;

    return pillar;
  }

  createTriggerPlate = (parent: Sprite, width: number) => {
    const button = new Graphics();

    const scale = width / parent.texture.width;
    button.roundRect(
      0,
      0,
      this.triggerPlateSize.width / scale,
      this.triggerPlateSize.height,
      4
    );
    button.fill();

    if (!this.pillarsAmount) return;

    button.x = width / 2 / scale - this.triggerPlateSize.width / 2 / scale;

    button.y = -this.triggerPlateSize.height / 4;

    parent.addChild(button);
  };

  createBridge(
    x: number = this.bridgePosition,
    y: number = this.pillarY
  ): Container {
    this.bridge = new Container();
    const width = 10;
    const initialHeight = 1;

    const bridgeSprite = new TilingSprite({
      texture: this.bridgeTexture,
      width: width,
      height: initialHeight,
    });

    this.bridge.addChild(bridgeSprite);
    this.bridge.x = x - width;
    this.bridge.y = y;
    return this.bridge;
  }

  growBridge(delta: number) {
    if (this.bridge) {
      const bridgeSprite = this.bridge.getChildAt(0) as TilingSprite;
      bridgeSprite.height -= delta * 500;
    }
  }

  foldsBridge = (delta: number) => {
    if (this.bridge) {
      if (this.bridge.rotation < Math.PI) {
        this.bridge.rotation += delta * 0.1;

        if (this.bridge.rotation >= Math.PI) {
          this.bridgeState = BridgeState.COLLAPSED;
          this.bridge.rotation = Math.PI;
        }
      }
    }
  };

  dropBridge(delta: number) {
    if (this.bridge) {
      if (this.bridge.rotation < Math.PI / 2) {
        this.bridge.rotation += delta * 2;

        if (this.bridge.rotation >= Math.PI / 2) {
          this.bridgeState = BridgeState.DROPPED;
          this.bridge.rotation = Math.PI / 2;
          this.endOfbridge = this.bridge.height + this.bridge.x;

          if (
            this.endOfbridge >
              this.currCneter - this.triggerPlateSize.width / 2 &&
            this.endOfbridge < this.currCneter + this.triggerPlateSize.width / 2
          ) {
            return (this.bridgeOutFits = BridgeOutfits.EXACT);
          }

          this.bridgeOutFits =
            this.endOfbridge > this.currMaxX
              ? BridgeOutfits.LARGER
              : this.endOfbridge < this.currMinX
              ? BridgeOutfits.LESSER
              : BridgeOutfits.NEAR;
        }
      }
    }
  }

  get currCneter() {
    return this.currMinX + (this.currMaxX - this.currMinX) / 2;
  }
}
