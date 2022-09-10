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
    collides(us, them) {
        
    }
    obstruct() { 

    }

    update() { 
        
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

    collides(candidate) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        });
    }

    obstruct(side) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side);
        });
    }

    draw() {
        
    }

    update(deltaTime, level) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level);
        });
        this.lifetime += deltaTime;
    }
}