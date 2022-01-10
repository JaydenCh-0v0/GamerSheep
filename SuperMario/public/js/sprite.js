//Import
import SpriteSheet from './spriteSheet.js';
import { loadImage } from './loaders.js';

export function loadCharacterSprites() {
    return loadImage('../src/img/characters.gif')
    .then(img => {
        //console.log('Character loaded', img);
        const sprites = new SpriteSheet(img, 16, 16);
        sprites.define('idle', 276, 44, 16, 16);
        return sprites;
    });
}

export function loadBackgroundSprites() {
    return loadImage('../src/img/mapTiles.png')
    .then(img => {
        //console.log('Image loaded', img);
        const sprites = new SpriteSheet(img, 16, 16);
        sprites.defineTile('ground', 0, 0);
        sprites.defineTile('sky', 3, 23);
        return sprites;
    });
}