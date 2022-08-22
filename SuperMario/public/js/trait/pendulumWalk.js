import { Sides, Trait } from "../entity.js";

export default class PendulumWalk extends Trait {
    constructor() {
        super('pendulumWalk');
        this.speed = -30;
    }

    obstruct(entity, side) {
        if (side === Sides.LFT || side === Sides.RIT) {
            this.speed = -this.speed;
        }
    }

    update(entity, deltaTime) {
        entity.vel.x = this.speed;
    }
}