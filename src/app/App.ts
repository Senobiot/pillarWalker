import { Application, Assets } from 'pixi.js';
import Game from '../scenes/Game';
import { getScreenSize } from '../utils';
import UI from '../scenes/UI';
import Background from '../scenes/Background';

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

  ui.showStartScreen();
  app.stage.addChild(bg);
  app.stage.addChild(ui);

  ui.startButton.onStart(() => {
    ui.hideStartScreen();
    ui.showScore();
    app.stage.addChild(game);
    game.start();
  });

  app.ticker.add((ticker) => {
    // bg.update(ticker.deltaTime);
    if (game.isGameActive && game.isHolding) {
      game.pillar.growBridge(ticker.deltaTime * 0.01);
    }
    if (game.pillar.isDropping) {
      game.pillar.dropBridge(ticker.deltaTime * 0.01);
    }
  });

  const gameContainer = document.getElementById('pixi-container');
  gameContainer?.appendChild(app.canvas);
};
