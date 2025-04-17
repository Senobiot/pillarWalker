import { Assets, Texture, Sprite } from 'pixi.js';

export type positionProps = {
  x: number;
  y: number;
  width: number;
  height?: number;
};

export default class Collectable extends Sprite {
  constructor(props: positionProps) {
    super(Texture.EMPTY);
    this.x = props.x;
    this.y = props.y + 5; // margin between bridge and item
    this.width = props.width;
    this.height = props.height || props.width;
    this.init();
  }

  async init() {
    const asset = await Assets.load('/pear.png');
    this.texture = new Texture(asset);
  }
}
