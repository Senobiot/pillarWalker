import { BitmapText } from 'pixi.js';
import { AppSizeProps } from '../../../app/App';

export default class Score extends BitmapText {
  currentScore: number = 0;
  constructor(appSize: AppSizeProps) {
    super('Score 0', {
      fontSize: 50,
      align: 'center',
      fill: '#ff0000',
    });

    this.x = appSize.width / 2;
    this.y = 50;
    this.currentScore;
  }
  setScore = (score: number) => (this.text = `Score: ${score}`);
  increaseScore = () => (this.text = `Score: ${++this.currentScore}`);
}
