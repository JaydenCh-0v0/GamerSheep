import Entity from "./entity.js";
import Velocity from "./trait/velocity.js";
import Jump from "./trait/jump.js";
import Go from "./trait/go.js";

import { loadCharacterSprites } from './sprite.js';

export function createMario() {
    return loadCharacterSprites()
    .then(sprite => {
        const mario = new Entity();
        mario.size.set(14,16);//small:(14,16)

        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        //mario.addTrait(new Velocity());

        mario.draw = function drawMario(ctx) {
            sprite.draw('idle', ctx, 0, 0);
        }

        return mario;
    });
}