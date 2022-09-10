import { Sides, Trait } from "../entity.js";

export default class PendulumWalk extends Trait {
    constructor() {
        super('pendulumWalk');
        this.enabled = true;
        this.speed = -30;
    }

    enable(newSpeed = this.speed) {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    obstruct(entity, side) {
        if (side === Sides.LFT || side === Sides.RIT) {
            this.speed = -this.speed;
        }
    }

    update(entity, deltaTime) {
        if (this.enabled) {
            entity.vel.x = this.speed;
        } else {
            entity.vel.x = 0;
        }
    }
}