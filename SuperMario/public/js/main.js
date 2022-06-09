//Import Class
import Camera from './camera.js';
import Timer from './timer.js';

//Import Function
import { loadLevel } from './loaders.js';
import { createCollisionLayer } from './layer.js';
import { createMario } from './entities.js';
import { setupKeyboard } from "./input.js";
import { setupMouseControl } from './debug.js';

//Run
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

Promise.all([
    createMario(),
    loadLevel('1-1'),
])
.then(([mario, level]) => {
    const camera = new Camera();
    window.camera = camera;

    mario.pos.set(64, 64);

    level.comp.layers.push(createCollisionLayer(level));

    level.entities.add(mario);


    const input = setupKeyboard(mario);
    input.listenTo(window);

    setupMouseControl(canvas, mario, camera);

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime){
        level.update(deltaTime);
        level.comp.draw(ctx, camera);
    }
    timer.start();
});