import { Sides, Trait } from "../entity.js";

export default class Killable extends Trait {
    constructor() {
        super('killable');
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = 2;
    }

    kill() {
        this.dead = true;
    }

    revive() {
        this.dead = false;
        this.deadTime = 0;
    }
    
    update(entity, deltaTime, level) {
        if (this.dead) {
            this.deadTime += deltaTime;
            if (this.deadTime > this.removeAfter) {
                level.entities.delete(entity);
            }
        }
    }
}