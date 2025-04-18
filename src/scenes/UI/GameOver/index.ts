import { Text, Container } from 'pixi.js';

import { italianoStyle } from '~/styles';
import Button from '~/entities/Button';
import { SizeProps } from '~/types';

export default class GameOver extends Container {
  retryButton: Button;
  text: Text;

  constructor(appSize: SizeProps) {
    super();

    this.position.set(
      appSize.width / 2 - this.width / 2,
      appSize.height / 2 - this.height
    );

    this.retryButton = new Button({
      text: 'RETRY',
      position: { x: 0, y: 130 },
      size: { width: 200, height: 75 },
    });
    this.text = new Text({
      text: 'GAME OVER \nScore: 0}',
    });
    this.text.anchor.set(0.5, 0.5);

    this.addChild(this.text);
    this.addChild(this.retryButton);
  }

  setScore = (score: number, collectables: number) => {
    this.text.text = `GAME OVER \nScore: ${score}\nFruits: ${collectables}`;
    this.text.style = italianoStyle;
  };
}
