//Import
import Compositor from './compositor.js';
import { loadLevel } from './loaders.js';
import { loadCharacterSprites, loadBackgroundSprites } from './sprite.js';
import { createBackgroundLayer } from './layer.js';

//Define
export function createSpriteLayer(sprite, pos) {
    return function drawSpriteLayer(ctx) {
        for (let i = 0; i < 20; i++) {
            sprite.draw('idle', ctx, pos.x, pos.y);
        }
    }
}

//Run
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

Promise.all([
    loadCharacterSprites(),
    loadBackgroundSprites(),
    loadLevel('1-1'),
])
.then(([characterSprite, backgroundSprite, level]) => {
    const comp = new Compositor();
    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprite);
    comp.layers.push(backgroundLayer);

    const pos = {
        x: 64,
        y: 64,
    };

    const vel = {
        x: 2,
        y: -10,
    };

    const spriteLayer = createSpriteLayer(characterSprite, pos);
    comp.layers.push(spriteLayer);

    function update(){
        comp.draw(ctx);
        characterSprite.draw('idle', ctx, pos.x, pos.y);
        pos.x += 2;
        pos.y += 2;
        requestAnimationFrame(update);
    }

    update();
});