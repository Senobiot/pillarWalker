import { Container, Sprite, Texture } from 'pixi.js';
import PillarsFabric from '~/entities/Pillar';
import Character from '~/entities/Character';
import Collectable from '~/entities/Collectable';
import { getChance, getRandInBounds } from '~/utils';
import {
  BridgeOutfits,
  BridgeState,
  CharacterState,
  GameState,
  SizeProps,
  TouchScren,
} from '~/types';
import FloatingText from '~/entities/Popup';

export default class Game extends Container {
  state: GameState;
  touchScreen: TouchScren | undefined;
  appSize: SizeProps;
  pillar: PillarsFabric;
  isHolding: boolean;
  holdStartTime: number = 0;
  minHoldTime: number = 200;
  pillars: Sprite[];
  bridge: Container | undefined;
  appStage: any;
  character: Character | undefined;
  characterGap: number = 50;
  characterFlip: boolean = false;
  characterMoving: boolean = false;
  touchTimeoutId: number | null;
  score: number = 0;
  initialX: number;
  collectableSize: SizeProps = { width: 32, height: 56 };
  collectableChance: number = 0.5;
  collectable: Sprite | null = null;
  private holdTimeoutId: ReturnType<typeof setTimeout> | null = null;
  applause: boolean = false;
  increaseScore: CallableFunction;
  increaseCollectables: CallableFunction;
  gotCollectable: boolean = false;

  constructor(
    appSize: SizeProps,
    appStage: Container,
    increaseScore: CallableFunction,
    increaseCollectables: CallableFunction
  ) {
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
    this.increaseScore = increaseScore;
    this.increaseCollectables = increaseCollectables;
    this.init();
  }

  init = () => {
    this.state = GameState.MENU;
    const pillarPosition = this.addPillar();
    this.character = new Character(this.appSize);
    const startBounds = this.pillars[0].getBounds();
    this.character.x =
      startBounds.x + startBounds.width / 2 - this.character.width / 2;
    this.character.y = pillarPosition.minY;
    this.addChild(this.character);
  };

  start = (restart: boolean = false) => {
    if (restart) {
      this.pillars.forEach((e) => e.destroy);
      this.pillars = [];
      this.children.forEach((child) => {
        child.destroy();
      });
      this.removeChildren();
      this.pillar = new PillarsFabric(this.appSize);
      const pillarPosition = this.addPillar();
      this.character = new Character(this.appSize);
      this.characterFlip = false;
      this.character.x = pillarPosition.maxX - 32;
      this.character.y = pillarPosition.minY;
      this.gotCollectable = false;

      this.addChild(this.character);
    }

    this.addPillar();
    this.state = GameState.ACTIVE;
    this.addListeners();
  };

  setCharacter = (textures: Texture[], texturesRun: Texture[]) => {
    if (this.character) {
      this.character.texturesRun = texturesRun;
      this.character.texturesStay = textures;
      this.character.textures = textures;
      this.character.play();
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
      }

      if (this.characterFlip) {
        if (this.collectable) {
          const gotCollectable = this.checkCollision(this.collectable.x);
          if (gotCollectable) {
            this.removeCollectable();
            this.gotCollectable = true;
          }
        }
        if (this.checkCollision()) {
          return (this.character.state = CharacterState.FALLING);
        }
      }

      if (
        this.pillar.bridgeOutFits === BridgeOutfits.EXACT ||
        this.pillar.bridgeOutFits === BridgeOutfits.NEAR
      ) {
        if (
          !this.applause &&
          this.pillar.bridgeOutFits === BridgeOutfits.EXACT
        ) {
          this.applause = true;

          this.addChild(
            new FloatingText('+1', this.pillar.endOfbridge, this.pillar.pillarY)
          );
          this.addChild(
            new FloatingText(
              'PERFECT!!!',
              this.appSize.width / 2 - this.x,
              this.height / 2
            )
          );
          this.increaseScore();
        }
        if (
          this.character.x <
          this.pillar.currMaxX - this.character.width / 1.5
        ) {
          return this.character.move(deltaTime);
        } else {
          this.removeCollectable();

          if (this.gotCollectable) {
            this.gotCollectable = false;
            this.increaseCollectables();
          }
          this.pillar.bridgeState = BridgeState.CROSSED;
          this.character.state = CharacterState.CROSSED;
          this.applause = false;
          this.character.changeAnimation();

          this.addPillar();
          this.addCollectable();
        }
      }
      if (this.pillar.bridgeOutFits === BridgeOutfits.LESSER) {
        if (this.character.x < this.pillar.endOfbridge) {
          return this.character.move(deltaTime);
        } else {
          this.pillar.bridgeState = BridgeState.FOLDING;
          return (this.character.state = CharacterState.FALLING);
        }
      }

      if (this.pillar.bridgeOutFits === BridgeOutfits.LARGER) {
        if (this.character.x < this.pillar.endOfbridge) {
          return this.character.move(deltaTime);
        } else {
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
