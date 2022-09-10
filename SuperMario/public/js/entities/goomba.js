import Entity, { Sides, Trait } from '../entity.js';
import PendulumWalk from '../trait/pendulumWalk.js';
import Killable from '../trait/killable.js';
import {loadSpriteSheet} from '../loaders.js';

export function loadGoomba() {
    return loadSpriteSheet('goomba')
    .then(createGoombaFactory);
}

// design goomba behavior
class Behavior extends Trait {
    constructor() {
        super('behavior')
    }
    collides(goomba, player) {
        if (goomba.killable.dead) return;
        if (player.stomper) {
            if (player.vel.y > goomba.vel.y) {
                player.stomper.bounce();
                goomba.killable.kill();
                goomba.pendulumWalk.disable();
            } else {
                player.killable.kill();
            }
        }
    }
}

function createGoombaFactory(sprite) {
    const walkAnime = sprite.animation.get('walk');

    function routeAnime(goomba) {
        if (goomba.killable.dead) return 'flat';
        return walkAnime(goomba.lifetime);
    }
    function drawGoomba(context) {
        sprite.draw(routeAnime(this), context, 0, 0, this.vel.x < 0);
    }

    return function createGoomba() {
        const goomba = new Entity();
        goomba.size.set(16, 16);

        // add traits
        goomba.addTrait(new PendulumWalk());
        goomba.addTrait(new Behavior());
        goomba.addTrait(new Killable());

        goomba.draw = drawGoomba;

        return goomba;
    };
}