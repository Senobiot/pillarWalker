import { Container, TilingSprite, Texture } from 'pixi.js';
import { AppSizeProps } from '../../app/App';

export default class Background extends Container {
  layers: { sprite: TilingSprite; speed: number }[];

  constructor(appSize: AppSizeProps, textures: Texture[]) {
    super();

    this.layers = textures.map((tex, index) => {
      const speed = index ** 2 * 0.5;
      const layer = new TilingSprite(tex, appSize.width, appSize.height);

      const scaleX = (appSize.width / tex.width) * 2;
      const scaleY = appSize.height / tex.height;
      layer.tileScale.set(scaleX, scaleY);

      layer.tilePosition.x = 0;
      this.addChild(layer);

      return { sprite: layer, speed };
    });
  }

  update(delta: number) {
    this.layers.forEach(({ sprite, speed }) => {
      sprite.tilePosition.x -= speed * delta;
    });
  }
}
