import BoundingBox from './boundingBox.js'
import {XY} from './math.js';

export const Sides = {
    TOP: Symbol('top'),
    BTM: Symbol('bottom'),
    LFT: Symbol('left'),
    RIT: Symbol('right')
}

// Trait-Class: 
export class Trait {
    constructor(name) {
        this.NAME = name;
    }

    obstruct() {

    }

    update() {
        console.warn('Unhandle update call in Trait');
    }
}

// Entity-Class: 
export default class Entity{
    constructor() {
        this.pos    = new XY(0, 0);
        this.vel    = new XY(0, 0);
        this.size   = new XY(0, 0);
        this.offset = new XY(0, 0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    obstruct(side) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side);
        });
    }

    update(deltaTime) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        });
        this.lifetime += deltaTime;
    }
}