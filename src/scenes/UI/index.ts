import { Container } from 'pixi.js';
import StartButton from './StartButton';
import { AppSizeProps } from '../../app/App';
import Score from './Score';
import GameOver from './GameOver';

export default class UI extends Container {
  startButton: StartButton;
  score: Score;
  gameOver: GameOver;

  constructor(appSize: AppSizeProps) {
    super();
    this.startButton = new StartButton(appSize);
    this.score = new Score(appSize);
    this.gameOver = new GameOver(appSize);
  }

  reset = () => {
    this.score.currentScore = 0;
    this.score.setScore();
  };

  showStartScreen = () => {
    this.addChild(this.startButton);
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
  };

  hideGameOverScreen = () => {
    this.removeChild(this.gameOver);
  };
}
