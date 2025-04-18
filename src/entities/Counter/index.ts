import { Text, TextStyle } from 'pixi.js';
import { regularStyle } from '~/styles';
import { PositionProps } from '~/types';

type CounterProps = {
  initialText?: string;
  initial?: number;
  position?: PositionProps;
  style?: TextStyle;
};

export default class Counter extends Text {
  currentScore: number = 0;
  initialText: string;

  constructor({
    initialText = 'Counter: ',
    initial = 0,
    position = { x: 0, y: 0 },
    style = regularStyle,
  }: CounterProps) {
    super(
      new Text({
        text: initialText + initial,
        style,
      })
    );

    this.x = position.x;
    this.y = position.y;
    this.currentScore;
    this.anchor.set(0.5, 0.5);
    this.initialText = initialText;
  }

  setCounter = (score: number = 0) => {
    this.currentScore = score;
    this.text = this.initialText + score;
  };

  increaseCounter = () => (this.text = this.initialText + ++this.currentScore);
}
