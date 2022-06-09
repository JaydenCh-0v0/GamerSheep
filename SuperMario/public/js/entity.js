import { Vec2d } from "./math.js";

export default class Entity {
    constructor() {
        this.pos = new Vec2d(0, 0);
        this.vel = new Vec2d(0, 0);
    }
}