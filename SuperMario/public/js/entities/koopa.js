import Entity, { Trait } from '../entity.js';
import PendulumWalk from '../trait/pendulumWalk.js';
import Killable from '../trait/killable.js';
//import Stomper from '../trait/stomper.js';
import {loadSpriteSheet} from '../loaders.js';

export function loadKoopa() {
    return loadSpriteSheet('koopa')
    .then(createKoopaFactory);
}

const STATE_WALKING = Symbol('walking');
const STATE_HIDING  = Symbol('hiding');

// design koopa behavior
class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.hideTime = 0;
        this.hideDuration = 2;
        this.state = STATE_WALKING;
    }

    collides(koopa, player) {
        if (koopa.killable.dead) return;

        if (player.stomper) {
            if (player.vel.y > koopa.vel.y) {
                this.handleStomp(koopa, player);
            } else {
                player.killable.kill();
            }
        }
    }

    handleStomp(us, them) {
        if (this.state === STATE_WALKING) {
            this.hide(us);
        } else if (this.state === STATE_HIDING) {
            us.killable.kill();
            us.vel.set(100, -200);
        }
    }

    hide(us) {
        us.pendulumWalk.disable();
        this.hideTime = 0;
        this.state = STATE_HIDING;
    }

    unhide(us) {
        us.pendulumWalk.enable();
        this.state = STATE_WALKING;
    }

    update(us, deltaTime) {
        if (this.state === STATE_HIDING) {
            this.hideTime += deltaTime;
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }
}


function createKoopaFactory(sprite) {
    const walkAnime = sprite.animation.get('walk');

    function routeAnime(koopa) {
        if (koopa.behavior.state === STATE_HIDING) return "hiding";
        return walkAnime(koopa.lifetime);
    }
    function drawKoopa(context) {
        sprite.draw(routeAnime(this), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;
        
        // add traits
        koopa.addTrait(new PendulumWalk());
        koopa.addTrait(new Behavior());
        koopa.addTrait(new Killable());

        koopa.draw = drawKoopa;

        return koopa;
    };
}