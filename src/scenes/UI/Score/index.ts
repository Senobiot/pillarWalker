import { Text } from 'pixi.js';
import { AppSizeProps } from '../../../app/App';
import { regularStyle } from '../../../styles';

export default class Score extends Text {
  currentScore: number = 0;

  constructor(appSize: AppSizeProps) {
    super(
      new Text({
        text: 'Score: 0',
        style: regularStyle,
      })
    );

    this.x = appSize.width / 2;
    this.y = 50;
    this.currentScore;
    this.anchor.set(0.5, 0.5);
  }
  setScore = (score: number = 0) => {
    this.currentScore = score;
    console.log(score);
    this.text = `Score: ${score}`;
    this.style = regularStyle;
  };

  increaseScore = () => (this.text = `Score: ${++this.currentScore}`);
}
