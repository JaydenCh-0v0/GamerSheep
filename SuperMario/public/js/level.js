import Compositor from "./compositor.js";
import EntityCollider from "./entityCollider.js";
import TileCollider from "./tileCollider.js";

//Level-Class: 
export default class Level {
    constructor() {
        this.gravity = 1200;
        this.totalTime = 0;

        this.comp = new Compositor();
        this.entities = new Set();
        
        this.tileCollider = null;
        this.entityCollider = new EntityCollider(this.entities);
    }

    setCollisionGrid(matrix) {
        this.tileCollider = new TileCollider(matrix);
    }

    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime, this);

            entity.pos.x += entity.vel.x * deltaTime;
            this.tileCollider.checkX(entity);

            entity.pos.y += entity.vel.y * deltaTime;
            this.tileCollider.checkY(entity);

            entity.vel.y += this.gravity * deltaTime;
        });

        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        });
        
        this.totalTime += deltaTime;
    }
}