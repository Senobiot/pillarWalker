import { Container, TilingSprite, Texture } from 'pixi.js';
import { SizeProps } from '~/types';

export default class Background extends Container {
  layers: { sprite: TilingSprite; speed: number }[];

  constructor(appSize: SizeProps, textures: Texture[]) {
    super();

    this.layers = textures.map((texture, index) => {
      const speed = index ** 2 * 0.5;
      const layer = new TilingSprite({
        texture,
        width: appSize.width,
        height: appSize.height,
      });

      const scaleX = (appSize.width / texture.width) * 2;
      const scaleY = appSize.height / texture.height;
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

  animateClouds(delta: number) {
    this.layers[1].sprite.tilePosition.x -= 3 * delta;
  }
}
