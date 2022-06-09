import {XY} from './math.js';

// Trait-Class: 
export class Trait {
    constructor(name) {
        this.NAME = name;
    }

    update() {
        console.warn('Unhandle update call in Trait');
    }
}

// Entity-Class: 
export default class Entity{
    constructor() {
        this.pos = new XY(0, 0);
        this.vel = new XY(0, 0);
        this.size = new XY(0, 0);

        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    update(deltaTime) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        });
    }
}