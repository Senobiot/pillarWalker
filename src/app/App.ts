import { Application, Assets, Graphics } from 'pixi.js';
import Game, { GameState } from '../scenes/Game';
import { getScreenSize } from '../utils';
import UI from '../scenes/UI';
import Background from '../scenes/Background';
import { CharacterState } from '../entities/Character';
import SelectScreen from '~/scenes/SelectScreen';

export type AppSizeProps = {
  width: number;
  height: number;
};

export default async () => {
  const { width, height } = getScreenSize();
  const appSize = {
    width: Math.min(width, 500),
    height: Math.min(height, 800),
  };

  const app = new Application();
  await app.init(appSize);

  const scaleFactor = Math.min(
    window.innerWidth / appSize.width,
    window.innerHeight / appSize.height
  );

  console.log('AppSize:', appSize);
  console.log('Scale Factor:', scaleFactor);
  console.log('Renderer Size:', app.renderer.width, app.renderer.height);

  const bgTexture_1 = await Assets.load('/_11_background.png');
  const bgTexture_2 = await Assets.load('/_08_clouds.png');
  const bgTexture_3 = await Assets.load('/_05_hill1.png');
  const bgTexture_4 = await Assets.load('/_02_trees and bushes.png');

  const bg = new Background(appSize, [
    bgTexture_1,
    bgTexture_2,
    bgTexture_3,
    bgTexture_4,
  ]);
  const ui = new UI(appSize);
  const game = new Game(appSize, app.stage);
  const selectScreen = new SelectScreen(appSize);

  game.y = 100;
  game.x = game.initialX;

  const gameMask = new Graphics();
  gameMask.fill(0xffffff);
  gameMask.rect(0, 0, appSize.width, appSize.height);
  gameMask.fill();

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
    game.setCharacter(selectScreen.textures);
    ui.showStartScreen();
    selectScreen.visible = false;
  });

  ui.gameOver.retryButton.onRetry(() => {
    game.x = 0;
    ui.reset();
    ui.showScore();
    ui.hideGameOverScreen();
    game.start(true);
    app.ticker.start();
  });

  app.ticker.add((ticker) => {
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
          ui.score.increaseScore();
          game.character.state = CharacterState.STAY;
        }
      }
    }

    if (game.state === GameState.OVER) {
      ui.showGameOver();
      app.ticker.stop();
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
