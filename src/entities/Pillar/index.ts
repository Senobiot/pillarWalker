import { Graphics } from 'pixi.js';
import { AppSizeProps } from '../../app/App';

export enum BridgeState {
  ROTATING = 'rotating',
  DROPPED = 'dropped',
  FOLDING = 'folding',
  COLLAPSED = 'collapsed',
  CROSSED = 'crossed',
  GROWING = 'growing',
  CREATING = 'creating',
}

export enum BridgeOutfits {
  LESSER = 'less',
  LARGER = 'larger',
  EXACT = 'exact',
  NEAR = 'near',
}

export default class PillarsFabric {
  bridgeState: BridgeState | undefined;
  defaultX: number = 0;
  pillarY: number = 300;
  pillarHeight: number = 170;
  currMaxX: number = 0;
  bridge: Graphics | null = null;
  endOfbridge: number = 0;
  bridgePosition: number = 0;
  currMinX: number = 0;
  bridgeOutFits: BridgeOutfits | undefined;
  triggerPlateSize: AppSizeProps = { width: 15, height: 5 };
  pillarsAmount: number = 0;

  constructor(appSize: AppSizeProps) {
    this.pillarY = appSize?.height - this.pillarHeight;
  }

  createPillar(): Graphics {
    const minGap = 100;
    const maxGap = 250;
    const randomGap =
      minGap + Math.floor(Math.random() * (maxGap - minGap + 1));

    const minWidth = 50;
    const maxWidth = 150;
    const randomWidth =
      minWidth + Math.floor(Math.random() * (maxWidth - minWidth + 1));

    const currentX = this.currMaxX ? this.currMaxX + randomGap : this.defaultX;

    const pillar = new Graphics();
    pillar.fill(0x000000);
    pillar.rect(currentX, this.pillarY, randomWidth, this.pillarHeight);
    pillar.fill();

    this.bridgePosition = this.currMaxX;
    this.bridgeState = BridgeState.CREATING;
    this.currMaxX = currentX + randomWidth;
    this.currMinX = currentX;

    this.createTriggerPlate(pillar, currentX + randomWidth / 2, this.pillarY);

    this.pillarsAmount++;

    return pillar;
  }

  createTriggerPlate = (parent: Graphics, x: number, y: number) => {
    const button = new Graphics();

    button.fill(0xff0000);
    button.rect(
      0,
      0,
      this.triggerPlateSize.width,
      this.triggerPlateSize.height
    );
    button.fill();

    button.x = x - this.triggerPlateSize.width / 2;
    button.y = y;

    if (!this.pillarsAmount) return;

    parent.addChild(button);
  };

  createBridge(
    x: number = this.bridgePosition,
    y: number = this.pillarY
  ): Graphics {
    this.bridge = new Graphics();
    const width = 5;
    const initialHeight = 1;

    this.bridge.fill(0x000000);
    this.bridge.rect(0, 0, width, initialHeight);
    this.bridge.fill();

    this.bridge.x = x - width;
    this.bridge.y = y;

    return this.bridge;
  }

  growBridge(delta: number) {
    if (this.bridge) {
      this.bridge.scale.y -= delta * 300;
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
