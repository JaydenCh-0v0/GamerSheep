
//Keyboard-class: Handle player key input
const PRESSED = 1, RELEASED = 0;
export default class Keyboard {
    constructor() {
        // Holds the key current state of a given key
        this.keyStates = new Map();

        // Holds the callback function for a key code
        this.keyMap = new Map();
    }

    addMapping(code, callback) { 
        this.keyMap.set(code, callback); 
    }

    handleEvent(event) {
        const {code} = event;

        //check the input is in the keymap or not
        if (!this.keyMap.has(code)) return false;

        //remove the preset functions from the keys
        event.preventDefault();


        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;
        if(this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);
        //console.log(this.keyStates);

        this.keyMap.get(code)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            //Handle Keyboard Input
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });
        });
    }
}
