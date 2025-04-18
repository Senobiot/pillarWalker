import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { AppSizeProps } from '~/app/App';
import PillarsFabric, { BridgeOutfits, BridgeState } from '~/entities/Pillar';
import Character, { CharacterState } from '~/entities/Character';
import Collectable from '~/entities/Collectable';
import { getChance, getRandInBounds } from '~/utils';
import { SizeProps } from '~/types';

export enum GameState {
  ACTIVE = 'active',
  PAUSED = 'paused',
  MENU = 'menu',
  OVER = 'over',
  STARTING = 'starting',
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
  minHoldTime: number = 200;
  pillars: Graphics[];
  bridge: Graphics = new Graphics();
  appStage: any;
  character: Character | undefined;
  characterGap: number = 50;
  characterFlip: boolean = false;
  characterMoving: boolean = false;
  touchTimeoutId: number | null;
  score: number = 0;
  initialX: number;
  collectableSize: SizeProps = { width: 32, height: 56 };
  collectableChance: number = 0.3;
  collectable: Sprite | null = null;
  private holdTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(appSize: AppSizeProps, appStage: Container) {
    super();
    this.state = GameState.MENU;
    this.touchScreen;
    this.appSize = appSize;
    this.pillar = new PillarsFabric(this.appSize);
    this.pillars = [];
    this.initialX = appSize.width / 2 - 50;
    this.isHolding = false;
    this.appStage = appStage;
    this.touchTimeoutId = null;
    this.init();
  }

  init = () => {
    console.log('game init');
    this.state = GameState.MENU;
    const pillarPosition = this.addPillar();
    this.character = new Character();
    this.character.x = pillarPosition.maxX - 32;
    this.character.y = pillarPosition.minY;
    this.addChild(this.character);
  };

  start = (restart: boolean = false) => {
    if (restart) {
      console.log(`restart ${restart}`);
      this.pillars.forEach((e) => e.destroy);
      this.pillars = [];
      this.children.forEach((child) => {
        child.destroy();
      });
      this.removeChildren();

      this.pillar = new PillarsFabric(this.appSize);
      const pillarPosition = this.addPillar();
      this.character = new Character();
      this.characterFlip = false;
      this.character.x = pillarPosition.maxX - 32;
      this.character.y = pillarPosition.minY;

      this.addChild(this.character);
    }

    console.log('game started');
    this.addPillar();

    this.state = GameState.ACTIVE;
    this.addListeners();
  };

  setCharacter = (textures: Texture[]) => {
    if (this.character) {
      this.character.texturesStay = textures;
      this.character.textures = textures;
      this.character.play();
      console.log('set new character');
    }
  };

  update = (deltaTime: number) => {
    if (this.state !== GameState.ACTIVE || !this.character) return;

    if (
      this.touchScreen === TouchScren.HOLDING &&
      this.pillar.bridgeState === BridgeState.GROWING &&
      this.character.state !== CharacterState.MOVING
    ) {
      return this.pillar.growBridge(deltaTime * 0.01);
    }
    if (this.pillar.bridgeState === BridgeState.ROTATING) {
      return this.pillar.dropBridge(deltaTime * 0.01);
    }

    if (
      this.pillar.bridgeState === BridgeState.DROPPED &&
      this.character.state !== CharacterState.FALLING
    ) {
      if (this.character.state !== CharacterState.MOVING) {
        this.character.state = CharacterState.MOVING;
        this.character.changeAnimation();
      }
      if (!this.character.playing) {
        this.character.play();
        this.addCollectable(); // Переделать а то никогда не будет!!!!!!!!!!!
      }

      if (this.characterFlip) {
        if (this.collectable) {
          const gotCollectable = this.checkCollision(this.collectable.x);
          if (gotCollectable) {
            this.removeCollectable();
            console.log('got coolectable');
          }
        }
        if (this.checkCollision()) {
          console.log('Врезался');
          return (this.character.state = CharacterState.FALLING);
        }
      }

      if (
        this.pillar.bridgeOutFits === BridgeOutfits.EXACT ||
        this.pillar.bridgeOutFits === BridgeOutfits.NEAR
      ) {
        if (
          this.character.x <
          this.pillar.currMaxX - this.character.width / 1.5
        ) {
          return this.character.move(deltaTime);
        } else {
          this.removeCollectable();
          this.pillar.bridgeState = BridgeState.CROSSED;
          this.character.state = CharacterState.CROSSED;
          this.character.changeAnimation();
          // this.character.stop(); // animation
          this.addPillar();
        }
      }
      if (this.pillar.bridgeOutFits === BridgeOutfits.LESSER) {
        if (this.character.x < this.pillar.endOfbridge) {
          return this.character.move(deltaTime);
        } else {
          console.log('упал с мостом');
          this.pillar.bridgeState = BridgeState.FOLDING;
          return (this.character.state = CharacterState.FALLING);
        }
      }

      if (this.pillar.bridgeOutFits === BridgeOutfits.LARGER) {
        if (this.character.x < this.pillar.endOfbridge) {
          return this.character.move(deltaTime);
        } else {
          console.log('упал с моста');
          return (this.character.state = CharacterState.FALLING);
        }
      }
    }

    if (this.character.state === CharacterState.FALLING) {
      if (this.character.y - this.character.height > this.appSize.height) {
        this.state = GameState.OVER;
        this.removeListeners();
        return this.character.destroy();
      }
      if (this.pillar.bridgeState === BridgeState.FOLDING) {
        this.pillar.foldsBridge(deltaTime);
      }
      this.character.falling(deltaTime);
    }
  };

  addListeners = () => {
    this.appStage.on('pointerdown', this.onPointerDown);
    this.appStage.on('pointerup', this.onPointerUp);
    this.appStage.on('pointerupoutside', this.onPointerUp);
    this.appStage.interactive = true;
  };

  removeListeners = () => {
    this.appStage.off('pointerdown', this.onPointerDown);
    this.appStage.off('pointerup', this.onPointerUp);
    this.appStage.off('pointerupoutside', this.onPointerUp);
    this.appStage.interactive = false;
  };

  checkCollision = (objectX = this.pillar.currMinX) => {
    if (!this.character) return;

    return this.character.x + this.character.width - 40 > objectX;
  };

  addPillar = () => {
    const pillar = this.pillar.createPillar();
    this.addChild(pillar);
    this.pillars.push(pillar);

    return pillar.getBounds();
  };

  addCollectable = () => {
    if (!getChance(this.collectableChance)) return;

    const positionX = getRandInBounds({
      minX: this.pillar.bridgePosition,
      maxX: this.pillar.currMinX,
      width: this.collectableSize.width,
    });

    this.collectable = new Collectable({
      x: positionX,
      y: this.pillar.pillarY,
      ...this.collectableSize,
    });

    this.addChild(this.collectable);
  };

  removeCollectable = () => {
    if (this.collectable) {
      this.removeChild(this.collectable);
      this.collectable.destroy();
      this.collectable = null;
    }
  };

  onPointerDown = () => {
    if (this.state !== GameState.ACTIVE) return;

    if (this.character?.state === CharacterState.MOVING) {
      this.character.flip();
      return (this.characterFlip = !this.characterFlip);
    }
    this.holdStartTime = Date.now();
    this.touchScreen = TouchScren.TAP;
    this.holdTimeoutId = setTimeout(() => {
      if (this.touchScreen === TouchScren.TAP) {
        this.touchScreen = TouchScren.HOLDING;
        this.bridge = this.pillar.createBridge();
        this.addChild(this.bridge);
        this.pillar.bridgeState = BridgeState.GROWING;
      }
    }, this.minHoldTime);
  };

  onPointerUp = () => {
    this.touchScreen = TouchScren.CLEAR;

    if (this.holdTimeoutId) {
      if (this.pillar.bridgeState === BridgeState.GROWING) {
        this.pillar.bridgeState = BridgeState.ROTATING;
      }
      clearTimeout(this.holdTimeoutId);
      this.holdTimeoutId = null;
    }
  };
}
