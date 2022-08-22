import Entity from '../entity.js';
import PendulumWalk from '../trait/pendulumWalk.js';
import {loadSpriteSheet} from '../loaders.js';

export function loadKoopa() {
    return loadSpriteSheet('koopa')
    .then(createKoopaFactory);
}

function createKoopaFactory(sprite) {
    const walkAnim = sprite.animation.get('walk');

    function drawKoopa(context) {
        sprite.draw(walkAnim(this.lifetime), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;
        
        koopa.addTrait(new PendulumWalk());

        koopa.draw = drawKoopa;

        return koopa;
    };
}