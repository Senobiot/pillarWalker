import { Container } from 'pixi.js';
import { AppSizeProps } from '../../app/App';

export default class Game extends Container {
  appSize: AppSizeProps;

  constructor(appSize: AppSizeProps) {
    super();
    this.appSize = appSize;
  }

  start = () => {
    console.log('game started');
  };
}
