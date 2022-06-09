//Import
import Compositor from './compositor.js';
import Entity from './entity.js';
import { createMainCharacter } from './entities.js';
import { loadLevel } from './loaders.js';
import { loadBackgroundSprites } from './sprite.js';
import { createBackgroundLayer, createSpriteLayer } from './layer.js';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

Promise.all([
    createMainCharacter(),
    loadBackgroundSprites(),
    loadLevel('1-1'),
])
.then(([mainCharacter, backgroundSprite, level]) => {
    const comp = new Compositor();

    const backgroundLayer = 
        createBackgroundLayer(level.backgrounds, backgroundSprite);
    comp.layers.push(backgroundLayer);

    const gravity = .5;

    const spriteLayer = createSpriteLayer(mainCharacter);
    comp.layers.push(spriteLayer);

    function update(){
        comp.draw(ctx);
        //characterSprite.draw('idle', ctx, mainCharacter.pos.x, mainCharacter.pos.y);
        mainCharacter.update();
        mainCharacter.vel.y += gravity;
        requestAnimationFrame(update);
    }

    update();
});