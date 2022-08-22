import Keyboard from "./keyboardState.js";

export function setupKeyboard(mario) {
    const input = new Keyboard();

    // Jump Function
    ['Space','KeyP'].forEach(key => {
        input.addMapping(key, keyState => {
            if (keyState) {
                mario.jump.start();
            } else {
                mario.jump.cancel();
            }
        });
    });

    // Speed UP Key
    input.addMapping('KeyO', keyState => { // ArrowRight
        mario.turbo(keyState);
    });

    // Move Right
    input.addMapping('KeyD', keyState => { // ArrowRight
        mario.go.dir += keyState ? 1 : -1;
    });

    // Move Left
    input.addMapping('KeyA', keyState => { // ArrowLeft
        mario.go.dir += keyState ? -1 : 1;
    });

    return input;
}