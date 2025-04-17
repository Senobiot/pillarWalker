import { Text, Ticker } from 'pixi.js';
import { lightBlueStyle } from '../../styles';

export default class FloatingText extends Text {
  constructor(text: string, x: number, y: number, duration: number = 1000) {
    super({ text, style: lightBlueStyle });

    this.anchor.set(0.5);
    this.x = x;
    this.y = y;
    const speed = -1;
    let elapsedTime = 0;

    const update = (ticker: Ticker) => {
      const delta = ticker.deltaTime;

      if (elapsedTime > duration) {
        Ticker.shared.remove(update);
        this.destroy();
        return;
      }

      elapsedTime += Ticker.shared.deltaMS;
      this.y += speed * delta;
    };

    Ticker.shared.add(update);
  }
}
