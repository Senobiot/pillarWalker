import { Container } from 'pixi.js';
import { AppSizeProps } from '../../app/App';
import Score from './Score';
import GameOver from './GameOver';

import Button from '~/entities/Button';
import { regularStyle, smallStyle } from '~/styles';

export default class UI extends Container {
  startButton: Button;
  score: Score;
  gameOver: GameOver;
  selectButton: Button;

  constructor(appSize: AppSizeProps) {
    super();
    this.startButton = new Button({
      size: { circleRadius: 80 },
      text: 'START',
      textStyle: regularStyle,
      variant: 'circle',
      position: { x: appSize.width / 2 + 80, y: appSize.height / 2 - 80 },
    });

    this.selectButton = new Button({
      size: { width: 200, height: 60 },
      text: 'Select character',
      textStyle: smallStyle,
      position: { x: appSize.width / 2, y: appSize.height / 2 },
    });
    this.score = new Score(appSize);
    this.gameOver = new GameOver(appSize);
  }

  reset = () => {
    this.score.currentScore = 0;
    this.score.setScore();
  };

  showStartScreen = () => {
    this.addChild(this.startButton);
    this.addChild(this.selectButton);
  };

  showScore = () => {
    this.addChild(this.score);
  };

  showGameOver = () => {
    this.removeChild(this.score);
    this.gameOver.setScore(this.score.currentScore);
    this.addChild(this.gameOver);
  };

  hideStartScreen = () => {
    this.removeChild(this.startButton);
    this.removeChild(this.selectButton);
  };

  hideGameOverScreen = () => {
    this.removeChild(this.gameOver);
  };
}
