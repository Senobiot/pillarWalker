import { Container } from 'pixi.js';
import StartButton from './StartButton';
import { AppSizeProps } from '../../app/App';
import Score from './Score';
import GameOver from './GameOver';
import SelectButton from './SelectButton';

export default class UI extends Container {
  startButton: StartButton;
  score: Score;
  gameOver: GameOver;
  selectButton: SelectButton;

  constructor(appSize: AppSizeProps) {
    super();
    this.startButton = new StartButton(appSize);
    this.score = new Score(appSize);
    this.gameOver = new GameOver(appSize);
    this.selectButton = new SelectButton(appSize);
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
