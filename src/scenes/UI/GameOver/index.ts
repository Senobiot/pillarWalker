import { Text, Container, TextStyle } from 'pixi.js';
import { AppSizeProps } from '../../../app/App';
import RetryButton from './RetryButton';

const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 40,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: '#ffffff',
  stroke: '#4a1850',
  dropShadow: true,
  wordWrap: true,
  wordWrapWidth: 440,
  align: 'center',
});

export default class GameOver extends Container {
  retryButton: RetryButton;
  text: Text;

  constructor(appSize: AppSizeProps) {
    super();

    this.position.set(
      appSize.width / 2 - this.width / 2,
      appSize.height / 2 - this.height / 2
    );

    this.retryButton = new RetryButton();
    this.text = new Text({
      text: 'GAME OVER \nScore: 0}',
    });
    this.text.anchor.set(0.5, 0.5);
    this.retryButton.position.set(0, 100);

    this.addChild(this.text);
    this.addChild(this.retryButton);
  }

  setScore = (score: number) => {
    console.log(score);
    this.text.text = `GAME OVER \nScore: ${score}`;
    this.text.style = style;
  };
}
