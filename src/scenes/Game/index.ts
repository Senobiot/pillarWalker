import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { AppSizeProps } from '../../app/App';
import PillarsFabric from '../../entities/Pillar';
import Character from '../../entities/Character';

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
  character: Character | undefined;
  characterMoving: boolean = false;
  finishWalking: any;

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
    const pillarPosition = pillar.getBounds();
    this.pillars.push(pillar);
    this.addChild(pillar);
    this.isGameActive = true;
    this.appStage.on('pointerdown', this.onPointerDown);
    this.appStage.on('pointerup', this.onPointerUp);
    this.appStage.on('pointerupoutside', this.onPointerUp);
    this.appStage.interactive = true;
    this.character = new Character();
    this.character.x = pillarPosition.maxX - 32 * 2;
    this.character.y = pillarPosition.minY - 32 * 2;
    const nextPillar = this.pillar.create();
    this.addChild(nextPillar);
    this.pillars.push(nextPillar);
    this.addChild(this.character);
  };

  update = (deltaTime: number) => {
    if (this.isGameActive && this.isHolding) {
      this.pillar.growBridge(deltaTime * 0.01);
    }
    if (this.pillar.isDropping) {
      this.pillar.dropBridge(deltaTime * 0.01);
    }

    if (this.pillar.isDropped && !this.finishWalking) {
      if (this.character?.x < this.pillar.previousPosition) {
        this.characterMoving = true;
        if (!this.character?.playing) {
          this.character?.play();
        }
        this.character?.move(deltaTime);
      } else {
        this.finishWalking = true;
        this.characterMoving = false;
        const nextPillar = this.pillar.create();
        this.addChild(nextPillar);
        this.pillars.push(nextPillar);
        this.character?.stop();
      }
    }
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
