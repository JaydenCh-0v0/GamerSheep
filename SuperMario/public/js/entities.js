import Entity from "./entity.js";
import { loadCharacterSprites } from './sprite.js';

export function createMainCharacter() {
    return loadCharacterSprites().then(sprite => {
        const mainCharacter = new Entity();
        mainCharacter.pos.set(64, 180);
        mainCharacter.vel.set(2, -10);
    

        mainCharacter.draw = function drawMainCharacter(ctx) {
            sprite.draw('idle', ctx, this.pos.x, this.pos.y);
        }

        mainCharacter.update = function updateMainCharacter() {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;        
        } 
        return mainCharacter;
    });
}