import { Container, Graphics } from 'pixi.js';
import { AppSizeProps } from '../../app/App';
import PillarsFabric, { BridgeState } from '../../entities/Pillar';
import Character, { CharacterState } from '../../entities/Character';

enum GameState {
  ACTIVE = 'active',
  PAUSED = 'paused',
  MENU = 'menu',
  OVER = 'over',
}

enum TouchScren {
  HOLDING = 'holding',
  TAP = 'tap',
  CLEAR = 'clear',
}

export default class Game extends Container {
  gameState: GameState;
  touchScreen: TouchScren | undefined;
  appSize: AppSizeProps;
  pillar: PillarsFabric;
  isHolding: boolean;
  holdStartTime: number = 0;
  minHoldTime: number = 100;
  pillars: Graphics[];
  bridge: Graphics = new Graphics();
  appStage: any;
  character: Character | undefined;
  characterMoving: boolean = false;

  constructor(appSize: AppSizeProps, appStage: Container) {
    super();
    this.gameState = GameState.MENU;
    this.touchScreen;
    this.appSize = appSize;
    this.pillar = new PillarsFabric(this.appSize);
    this.pillars = [];
    this.isHolding = false;
    this.appStage = appStage;
  }

  start = () => {
    console.log('game started');
    const pillar = this.pillar.create();
    const pillarPosition = pillar.getBounds();
    this.pillars.push(pillar);
    this.addChild(pillar);
    this.gameState = GameState.ACTIVE;
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
    if (this.gameState !== GameState.ACTIVE) return;

    if (this.touchScreen === TouchScren.HOLDING) {
      return this.pillar.growBridge(deltaTime * 0.01);
    }
    if (this.pillar.bridgeState !== BridgeState.DROPPED) {
      return this.pillar.dropBridge(deltaTime * 0.01);
    }

    if (!this.character) return;

    if (
      this.pillar.bridgeState === BridgeState.DROPPED &&
      this.character.x < this.pillar.endOfbridge
    ) {
      if (!this.character.playing) {
        this.character.state === CharacterState.MOVING;
        this.character.play();
      }
      this.character.move(deltaTime);
    } else {
      this.pillar.bridgeState = BridgeState.CROSSED;
      this.character.state === CharacterState.STAY;
      const nextPillar = this.pillar.create();
      this.addChild(nextPillar);
      this.pillars.push(nextPillar);
      this.character.stop(); // animation
    }
  };

  onPointerDown = () => {
    if (this.gameState !== GameState.ACTIVE) return;

    this.holdStartTime = Date.now();
    this.touchScreen = TouchScren.HOLDING;

    setTimeout(() => {
      if (this.touchScreen === TouchScren.HOLDING) {
        this.bridge = this.pillar.createBridge();
        this.addChild(this.bridge);
      }
    }, this.minHoldTime);
  };

  onPointerUp = () => {
    if ((this.touchScreen = TouchScren.HOLDING)) {
      this.touchScreen = TouchScren.CLEAR;
      const holdDuration = Date.now() - this.holdStartTime;
      if (holdDuration >= this.minHoldTime) {
        this.pillar.bridgeState = BridgeState.ROTATING;
      }
    }
  };
}
