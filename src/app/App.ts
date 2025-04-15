import { Application } from 'pixi.js';
import Game from '../scenes/Game';
import { getScreenSize } from '../utils';
import UI from '../scenes/UI';

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

  const ui = new UI(appSize);
  const game = new Game(appSize);

  ui.showStartScreen();
  app.stage.addChild(ui);

  ui.startButton.onStart(() => {
    ui.hideStartScreen();
    ui.showScore();
    app.stage.addChild(game);
    game.start();
  });

  const gameContainer = document.getElementById('pixi-container');
  gameContainer?.appendChild(app.canvas);
};
