import { Container } from 'pixi.js';
import StartButton from './StartButton';
import { AppSizeProps } from '../../app/App';
import Score from './Score';

export default class UI extends Container {
  startButton: StartButton;
  score: Score;

  constructor(appSize: AppSizeProps) {
    super();
    this.startButton = new StartButton(appSize);
    this.score = new Score(appSize);
  }

  showStartScreen = () => {
    this.addChild(this.startButton);
  };

  showScore = () => {
    this.addChild(this.score);
  };

  hideStartScreen = () => {
    this.removeChild(this.startButton);
  };
}
