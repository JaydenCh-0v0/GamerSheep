import Level from "./level.js";
import { createBackgroundLayer, createSpriteLayer } from "./layer.js";
import { loadBackgroundSprites } from './sprite.js';

//Game Loader
export function loadImage(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener('load', () => { 
            resolve(img); 
        });
        img.src = url;
    });
}

function createTiles(level, backgrounds) {
    function applyRange(bgd, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;

        for (let i = xStart; i < xEnd; i++) {
            for (let j = yStart; j < yEnd; j++) {
                level.tiles.set(i, j, {
                    name: bgd.tile,
                });
            }
        }
    }

    backgrounds.forEach(bgd => {
        bgd.ranges.forEach(range => {
            if (range.length === 4) {
                const [xStart, xLen, yStart, yLen] = range;
                applyRange(bgd, xStart, xLen, yStart, yLen);
            } else if (range.length === 3) {
                const [xStart, xLen, yStart] = range;
                applyRange(bgd, xStart, xLen, yStart, 1);
            } else if (range.length === 2) {
                const [xStart, yStart] = range;
                applyRange(bgd, xStart, 1, yStart, 1);
            }
        });
    })
}

export function loadLevel(name) {
    return Promise.all([
        fetch(`../src/levels/${name}.json`).then( r => r.json() ),
        loadBackgroundSprites(),
    ])
    .then(([ LevelSpec, backgroundSprite ] ) => {
        const level = new Level();

        createTiles(level, LevelSpec.backgrounds);

        const backgroundLayer = createBackgroundLayer(level, backgroundSprite);
        level.comp.layers.push(backgroundLayer);

        const spriteLayer = createSpriteLayer(level.entities);
        level.comp.layers.push(spriteLayer);

        return level;
    })
}