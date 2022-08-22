
import SpriteSheet from "./spriteSheet.js";
import { createAnime } from "./anime.js";

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

export function loadJSON(url) { return fetch(url).then(r => r.json()); }

export function loadSpriteSheet(name) {
    return loadJSON(`../js/sprites/${name}.json`)
    .then(sheetSpec => Promise.all([
        sheetSpec,
        loadImage(sheetSpec.imageURL)
    ]))
    .then(([sheetSpec, img]) => {
        const sprites = new SpriteSheet(
            img, 
            sheetSpec.tileW, 
            sheetSpec.tileH
        );
        if(sheetSpec.tiles){
            sheetSpec.tiles.forEach(tileSpec => {
                sprites.defineTile(
                    tileSpec.name, 
                    tileSpec.index[0], 
                    tileSpec.index[1]
                    );
            });
        }
        
        if(sheetSpec.frames) {
            sheetSpec.frames.forEach(frameSpec => {
                sprites.define( frameSpec.name, ...frameSpec.rect );
            });
        }

        if(sheetSpec.animations) {
            sheetSpec.animations.forEach(animeSpec => {
                const animation = createAnime(animeSpec.frames, animeSpec.frameLen);
                sprites.defineAnime(animeSpec.name, animation);
            });
        }

        return sprites;
    })
}