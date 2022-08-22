//Timer-class: implement the game time separated with game frame
export default class Timer {
    constructor(deltaTime = 1/60) {
        let accumulatedTime = 0, //accumulate the game frame time
            lastTime = 0;

        this.updateProxy = (time) => {
            accumulatedTime += (time - lastTime) / 1000;
    
            if (accumulatedTime > 1) {
                accumulatedTime = 1;
            }

            while (accumulatedTime > deltaTime) { //when the accumulated frame time satisfy one game time
                this.update(deltaTime);
                accumulatedTime -= deltaTime;
            }
    
            lastTime = time;
            this.enqueue();
        }
    }

    enqueue() {
        requestAnimationFrame(this.updateProxy);
    }

    start() {
        this.enqueue();
    }
}