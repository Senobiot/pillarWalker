import { Text, Container } from 'pixi.js';
import { AppSizeProps } from '../../../app/App';
import RetryButton from './RetryButton';
import { italianoStyle } from '../../../styles';

export default class GameOver extends Container {
  retryButton: RetryButton;
  text: Text;

  constructor(appSize: AppSizeProps) {
    super();

    this.position.set(
      appSize.width / 2 - this.width / 2,
      appSize.height / 2 - this.height
    );

    this.retryButton = new RetryButton();
    this.text = new Text({
      text: 'GAME OVER \nScore: 0}',
    });
    this.text.anchor.set(0.5, 0.5);
    this.retryButton.position.set(0, 130);

    this.addChild(this.text);
    this.addChild(this.retryButton);
  }

  setScore = (score: number, collectables: number) => {
    this.text.text = `GAME OVER \nScore: ${score}\nFruits: ${collectables}`;
    this.text.style = italianoStyle;
  };
}
