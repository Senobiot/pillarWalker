import { Application, Assets, Graphics } from 'pixi.js';
import Game, { GameState } from '../scenes/Game';
import { getScreenSize } from '../utils';
import UI from '../scenes/UI';
import Background from '../scenes/Background';
import { CharacterState } from '../entities/Character';

export type AppSizeProps = {
  width: number;
  height: number;
};

export default async () => {
  const { width, height } = getScreenSize();
  const appSize = {
    width: width < 500 ? width : 500,
    height: height < 800 ? height : 800,
  };

  const app = new Application();
  await app.init(appSize);
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

  const gameMask = new Graphics();
  gameMask.beginFill(0xffffff);
  gameMask.drawRect(0, 0, appSize.width, appSize.height);
  gameMask.endFill();

  game.mask = gameMask;
  app.stage.addChild(gameMask);

  ui.showStartScreen();
  app.stage.addChild(bg);
  app.stage.addChild(ui);

  ui.startButton.onStart(() => {
    ui.hideStartScreen();
    ui.showScore();
    app.stage.addChild(game);
    game.start();
  });

  ui.gameOver.retryButton.onRetry(() => {
    ui.showScore();
    game.start();
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
    }
  });

  const gameContainer = document.getElementById('pixi-container');
  gameContainer?.appendChild(app.canvas);
};
