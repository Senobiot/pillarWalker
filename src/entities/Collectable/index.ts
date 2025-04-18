import { Assets, Texture, Sprite } from 'pixi.js';
import { PositionProps } from '~/types';

export default class Collectable extends Sprite {
  constructor(props: PositionProps) {
    super(Texture.EMPTY);
    this.x = props.x;
    this.y = props.y + 5; // margin between bridge and item
    this.width = props.width || 36;
    this.height = props.height || props.width || 56;
    this.texture = new Texture(Assets.get('pear'));
  }
}
