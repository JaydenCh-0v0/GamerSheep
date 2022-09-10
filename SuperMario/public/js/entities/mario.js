//Import Class
import Entity, { Trait } from "../entity.js";

//Import Traits
import Go from "../trait/go.js";
import Jump from "../trait/jump.js";
import Stomper from "../trait/stomper.js";
import Killable from "../trait/killable.js";
import PlayerController from "../trait/playerController.js";

//Import Function
import { loadSpriteSheet } from "../loaders.js";

//Mario's Value
const SLOW_DRAG = 1/1000;
const FAST_DRAG = 1/5000;

//Public:
export function loadMario() {
    return loadSpriteSheet('mario')
    .then(createMarioFactory);
}

//Private:
function createMarioFactory(sprite) {
    const runAnime = sprite.animation.get('run');
    //createAnime(['run-1','run-2','run-3'], FRAME_LEN);
    function routeFrame(mario) {
        if (mario.jump.falling) {
            return 'jump';
        }
        if (mario.go.distance > 0) {
            if((mario.vel.x > 0 && mario.go.dir < 0) || (mario.vel.x < 0 && mario.go.dir > 0)) {
                return 'break';
            }
            return runAnime(mario.go.distance);
        }
        return 'idle';
    }

    function setTurboState(turboOn) {
        this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
    }

    function drawMario(ctx) {
        sprite.draw(routeFrame(this), ctx, 0, 0, this.go.heading < 0);
    }

    return function createMario() {
        const mario = new Entity();
        mario.size.set(14, 16); // small:(14,16)
        
        // add traits
        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        mario.addTrait(new Stomper());
        mario.addTrait(new Killable());
        mario.killable.removeAfter = 0;
        mario.addTrait(new PlayerController());
        mario.playerController.setPlayer(mario);
        
        mario.turbo = setTurboState;
        mario.draw = drawMario;

        mario.turbo(false);
        
        return mario;
    }
}