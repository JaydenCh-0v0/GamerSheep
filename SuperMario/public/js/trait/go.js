import { Sides, Trait } from "../entity.js";

export default class Go extends Trait {
    constructor() {
        super('go');
        this.dir = 0;
        //this.speed = 4000;
        this.acceleration = 400;
        this.deceleration = 300;
        this.dragFactor = 1/5000;

        this.distance = 0;
        this.heading = 1;
    }

    update(entity, deltaTime) {
        const absX = Math.abs(entity.vel.x);

        if (this.dir !== 0) {
            entity.vel.x += this.acceleration * deltaTime * this.dir;
            this.heading = this.dir;
        } else if(entity.vel.x !== 0) {
            const decel = Math.min(absX, this.deceleration * deltaTime);
            entity.vel.x += entity.vel.x > 0 ? -decel : decel; // drag floor code
        } else {
            this.distance = 0;
        }

        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;
        
        this.distance += absX * deltaTime;
    }
}