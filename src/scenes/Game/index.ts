import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { AppSizeProps } from '../../app/App';
import PillarsFabric from '../../entities/Pillar';

export default class Game extends Container {
  appSize: AppSizeProps;
  pillar: PillarsFabric;
  isGameActive: boolean;
  isHolding: boolean;
  holdStartTime: number = 0;
  minHoldTime: number = 100;
  pillars: Graphics[];
  bridge: Graphics = new Graphics();
  appStage: any;

  constructor(appSize: AppSizeProps, appStage: Container) {
    super();
    this.appSize = appSize;
    this.pillar = new PillarsFabric(this.appSize);
    this.pillars = [];
    this.isGameActive = false;
    this.isHolding = false;
    this.appStage = appStage;
  }

  start = () => {
    console.log('game started');
    const pillar = this.pillar.create();
    this.pillars.push(pillar);
    this.addChild(pillar);
    this.isGameActive = true;
    this.appStage.on('pointerdown', this.onPointerDown);
    this.appStage.on('pointerup', this.onPointerUp);
    this.appStage.on('pointerupoutside', this.onPointerUp);
    this.appStage.interactive = true;
  };

  onPointerDown = (event: FederatedPointerEvent) => {
    if (!this.isGameActive) return;

    this.holdStartTime = Date.now();
    this.isHolding = true;
    setTimeout(() => {
      if (this.isHolding) {
        this.bridge = this.pillar.createBridge();
        this.addChild(this.bridge);
      }
    }, this.minHoldTime);
  };

  onPointerUp = (event: FederatedPointerEvent) => {
    if (this.isHolding) {
      this.isHolding = false;
      const holdDuration = Date.now() - this.holdStartTime;
      if (holdDuration >= this.minHoldTime) {
        this.pillar.isDropping = true;
      }
    }
  };
}
