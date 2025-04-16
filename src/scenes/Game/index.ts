import { Container, Graphics } from 'pixi.js';
import { AppSizeProps } from '../../app/App';
import PillarsFabric, {
  BridgeOutfits,
  BridgeState,
} from '../../entities/Pillar';
import Character, { CharacterState } from '../../entities/Character';

export enum GameState {
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
  state: GameState;
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
  characterGap: number = 50;
  characterMoving: boolean = false;
  touchTimeoutId: number | null;

  constructor(appSize: AppSizeProps, appStage: Container) {
    super();
    this.state = GameState.MENU;
    this.touchScreen;
    this.appSize = appSize;
    this.pillar = new PillarsFabric(this.appSize);
    this.pillars = [];
    this.isHolding = false;
    this.appStage = appStage;
    this.touchTimeoutId = null;
  }

  start = () => {
    console.log('game started');
    const pillarPosition = this.addPillar();

    this.state = GameState.ACTIVE;
    this.appStage.on('pointerdown', this.onPointerDown);
    this.appStage.on('pointerup', this.onPointerUp);
    this.appStage.on('pointerupoutside', this.onPointerUp);
    this.appStage.interactive = true;

    this.character = new Character();
    this.character.x = pillarPosition.maxX - 32 * 2;
    this.character.y = pillarPosition.minY - 32 * 2;

    this.addPillar();
    this.addChild(this.character);
  };

  update = (deltaTime: number) => {
    if (this.state !== GameState.ACTIVE) return;

    if (
      this.touchScreen === TouchScren.HOLDING &&
      this.pillar.bridgeState === BridgeState.GROWING
    ) {
      return this.pillar.growBridge(deltaTime * 0.01);
    }
    if (this.pillar.bridgeState !== BridgeState.DROPPED) {
      return this.pillar.dropBridge(deltaTime * 0.01);
    }

    if (!this.character) return;

    if (this.pillar.bridgeState === BridgeState.DROPPED) {
      if (!this.character.playing) {
        this.character.play();
      }
      this.character.state = CharacterState.MOVING;
      if (this.pillar.bridgeOutFits === BridgeOutfits.EXACT) {
        if (
          this.character.x <
          this.pillar.currMaxX - this.character.width / 1.5
        ) {
          return this.character.move(deltaTime);
        } else {
          this.pillar.bridgeState = BridgeState.CROSSED;
          this.character.state = CharacterState.CROSSED;
          this.character.stop(); // animation
          this.addPillar();
        }
      }
      if (this.pillar.bridgeOutFits === BridgeOutfits.LESSER) {
        if (
          this.character.x <
          this.pillar.endOfbridge - this.character.width / 1.5
        ) {
          return this.character.move(deltaTime);
        } else {
          this.character.state = CharacterState.STAY;
          console.log('упал с мостом');
        }
      }

      if (this.pillar.bridgeOutFits === BridgeOutfits.LARGER) {
        if (this.character.x < this.pillar.endOfbridge) {
          return this.character.move(deltaTime);
        } else {
          this.character.state = CharacterState.STAY;
          console.log('упал с моста');
        }
      }
    }
  };

  addPillar = () => {
    const pillar = this.pillar.create();
    this.addChild(pillar);
    this.pillars.push(pillar);
    return pillar.getBounds();
  };

  onPointerDown = () => {
    if (this.state !== GameState.ACTIVE) return;

    this.holdStartTime = Date.now();
    this.touchScreen = TouchScren.HOLDING;
    console.log(this.pillar.bridgeState);
    setTimeout(() => {
      if (this.touchScreen === TouchScren.HOLDING) {
        this.bridge = this.pillar.createBridge();
        this.addChild(this.bridge);
        this.pillar.bridgeState = BridgeState.GROWING;
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
