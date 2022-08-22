import { XY } from './math.js';

export default class Camera {
    constructor() {
        this.pos = new XY(0, 0);
        this.size = new XY(256, 224);
    }
}