import { Application, Assets, Container, Graphics } from 'pixi.js';
import Game from '../scenes/Game';
import { getScreenSize } from '../utils';
import UI from '../scenes/UI';
import GameOver from '../scenes/Screens/GameOver';

(async () => {
  // const margins = { x: 25, y: 25 };
  // const { width, height } = getScreenSize();
  const appSize = {
    width: 1600,
    height: 900,
  };

  const app = new Application();
  await app.init(appSize);

  const mapContainer = new Container();
  const ui = new UI();
  const gameOverScreen = new GameOver(appSize);

  app.stage.addChild(mapContainer);
  // app.stage.addChild(ui);
  app.stage.addChild(gameOverScreen);

  const mask = new Graphics()
    .rect(0, 0, appSize.width, appSize.height)
    .fill(0xffffff);

  mapContainer.mask = mask;
  const game = new Game();

  const gameContainer = document.getElementById('pixi-container');
  gameContainer?.appendChild(app.canvas);
})();
