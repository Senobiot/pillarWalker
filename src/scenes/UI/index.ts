import { Container, Text } from 'pixi.js';
import GameOver from './GameOver';

import Button from '~/entities/Button';
import { regularStyle, skewStyle, smallStyle } from '~/styles';
import Counter from '~/entities/Counter';
import { SizeProps } from '~/types';

export default class UI extends Container {
  startButton: Button;
  score: Counter;
  collectablesScore: Counter;
  gameOver: GameOver;
  selectButton: Button;
  title: Text = new Text();

  constructor(appSize: SizeProps) {
    super();

    this.title = new Text({
      text: 'PILLAR WALKER',
      style: skewStyle,
    });

    this.title.x = appSize.width / 2 - this.title.width / 2;
    this.title.y = 25;
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

    this.score = new Counter({
      initialText: 'Score: ',
      position: { x: appSize.width / 2, y: 30 },
    });

    this.collectablesScore = new Counter({
      initialText: 'Friuts: ',
      style: smallStyle,
      position: { x: appSize.width / 2, y: 65 },
    });
    this.gameOver = new GameOver(appSize);
  }

  reset = () => {
    this.score.currentScore = 0;
    this.score.setCounter(0);
    this.collectablesScore.setCounter(0);
  };

  showStartScreen = () => {
    this.addChild(this.startButton);
    this.addChild(this.selectButton);
    this.addChild(this.title);
  };

  showScore = () => {
    this.addChild(this.score);
    this.addChild(this.collectablesScore);
  };

  showGameOver = () => {
    this.removeChild(this.score);
    this.removeChild(this.collectablesScore);
    this.gameOver.setScore(
      this.score.currentScore,
      this.collectablesScore.currentScore
    );
    this.addChild(this.gameOver);
  };

  hideStartScreen = () => {
    this.removeChild(this.startButton);
    this.removeChild(this.selectButton);
    this.removeChild(this.title);
  };

  hideGameOverScreen = () => {
    this.removeChild(this.gameOver);
  };
}
