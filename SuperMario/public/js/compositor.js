
export default class Compositor {
    constructor() {
        this.layers = [];
    }

    draw(ctx, camera) {
        this.layers.forEach(layer => {
            layer(ctx, camera);
        });
    }
}