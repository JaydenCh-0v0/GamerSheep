//Import Class
import Camera from './camera.js';
import Timer from './timer.js';
import Entity from './entity.js';
import PlayerController from './trait/playerController.js';

//Import Function
import { createLevelLoader } from './loaders/level.js';
import { setupKeyboard } from "./input.js";
import { setupMouseControl } from './debug.js';
import { createCollisionLayer } from './layer.js';
import { loadEntities } from './entities.js';

//Run
const canvas = document.getElementById('screen');
let debug = false;
//debug = true;

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

async function main(canvas) {
    const ctx = canvas.getContext('2d');
    const entityFactory = await loadEntities();
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');
    const camera = new Camera();

    // tyr to say Hello world
    ctx.font = "20px Arial";
    //ctx.fillText("Super Holomem project", 300, 50)

    const mario = entityFactory.mario();

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    if(debug) {
        level.comp.layers.push(createCameraLayer(camera));
        level.comp.layers.push(createCollisionLayer(level))
    }

    const input = setupKeyboard(mario);
    input.listenTo(window);

    if (debug) setupMouseControl(canvas, mario, camera);

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime){
        level.update(deltaTime);

        if (mario.pos.x > 100) {
            camera.pos.x = Math.max(0, mario.pos.x - 100);
        }

        level.comp.draw(ctx, camera);
    }
    timer.start();
}
main(canvas);