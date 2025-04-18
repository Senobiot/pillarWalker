import { Application, Assets, Graphics } from 'pixi.js';
import Game from '~/scenes/Game';
import { getScreenSize } from '~/utils';
import UI from '~/scenes/UI';
import Background from '../scenes/Background';
import SelectScreen from '~/scenes/SelectScreen';
import { manifest } from '~/config';
import { CharacterState, GameState } from '~/types';

export default async () => {
  const shakeFrames = { total: 75, current: 0 };

  const { width, height } = getScreenSize();
  const appSize = {
    width: Math.min(width, 600),
    height: Math.min(height, 1000),
    scaleFactor: Math.min(width, 600) / 600,
  };

  const app = new Application();
  await app.init(appSize);
  await Assets.init({ manifest });
  await Assets.loadBundle('background');
  await Assets.loadBundle('collectables');
  await Assets.loadBundle('pillars');

  const bg = new Background(appSize, [
    Assets.get('sky'),
    Assets.get('clouds'),
    Assets.get('hill1'),
    Assets.get('trees'),
  ]);

  const ui = new UI(appSize);
  const game = new Game(
    appSize,
    app.stage,
    ui.score.increaseCounter,
    ui.collectablesScore.increaseCounter
  );
  const selectScreen = new SelectScreen(appSize);

  game.y = 100;
  game.x = game.initialX;

  const gameMask = new Graphics();
  gameMask.fill(0xffffff).rect(0, 0, appSize.width, appSize.height).fill();

  game.mask = gameMask;
  app.stage.addChild(gameMask);

  ui.showStartScreen();

  app.stage.addChild(bg);
  app.stage.addChild(game);
  app.stage.addChild(ui);
  app.stage.addChild(selectScreen);

  ui.startButton.onClick(() => {
    ui.hideStartScreen();
    ui.showScore();
    game.state = GameState.STARTING;
  });

  ui.selectButton.onClick(() => {
    ui.hideStartScreen();
    selectScreen.visible = true;
  });

  selectScreen.confirmButton.onClick(() => {
    game.setCharacter(selectScreen.textures, selectScreen.texturesRun);
    ui.showStartScreen();
    selectScreen.visible = false;
  });

  ui.gameOver.retryButton.onClick(() => {
    game.x = 0;
    bg.x = 0;
    game.y = 0;
    ui.reset();
    ui.showScore();
    ui.hideGameOverScreen();
    game.start(true);
    app.ticker.start();
  });

  app.ticker.add((ticker) => {
    bg.animateClouds(ticker.deltaTime);

    if (game.state === GameState.ACTIVE) {
      game.update(ticker.deltaTime);

      if (!game.character) return;

      if (game.character.state === CharacterState.MOVING) {
        bg.update(ticker.deltaTime);
      }

      if (game.character.state === CharacterState.CROSSED) {
        if (game.character.getGlobalPosition().x > game.characterGap) {
          const speed = 5;
          game.x -= speed;
        } else {
          ui.score.increaseCounter();
          game.character.state = CharacterState.STAY;
        }
      }
    }

    if (game.state === GameState.OVER) {
      if (shakeFrames.current < shakeFrames.total) {
        if (shakeFrames.current % 2 === 0) {
          game.x += Math.random() * 10 - 5;
          game.y += Math.random();
          bg.x = Math.random() * 10 - 5;
        }
        shakeFrames.current++;
      } else {
        ui.showGameOver();
        app.ticker.stop();
        shakeFrames.current = 0;
      }
    }

    if (game.state === GameState.STARTING) {
      if (game.y > 0 || game.x > 0) {
        const speed = 1;
        if (game.x > 0) {
          game.x -= speed * 2;
        }
        if (game.y > 0) {
          game.y -= speed;
        }
      } else {
        game.state = GameState.ACTIVE;
        game.start();
      }
    }
  });

  const gameContainer = document.getElementById('pixi-container');
  gameContainer?.appendChild(app.canvas);
};
