import { Sides, Trait } from "../entity.js";
import { XY } from "../math.js";

export default class PlayerController extends Trait {
    constructor() {
        super('playerController');
        this.checkpoint = new XY(0, 0);
        this.player = null;
    }

    setPlayer(entity) {
        this.player = entity;
    }

    update(entity, deltaTime, level) {
        if (!level.entities.has(this.player)) {
            this.player.killable.revive();
            this.player.pos.set(4 * 16, 4 * 16);
            level.entities.add(this.player);
        }
    }
}