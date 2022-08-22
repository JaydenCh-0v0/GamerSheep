//Sprite image from the tileset => game map

export default 
class SpriteSheet {
    constructor(image, width, height) {
        this.image  = image;
        this.width  = width;
        this.height = height;
        this.tiles = new Map();
        this.animation = new Map();
    }

    define(name, x, y, width, height) {
        const buffers = [false, true].map( flip => {
            const buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;

            const ctx = buffer.getContext('2d');

            if (flip) {
                ctx.scale(-1, 1);
                ctx.translate(-width, 0);
            }

            ctx.drawImage(
                this.image,
                x, 
                y,
                width,
                height,
                0,
                0,
                width,
                height
            );
            return buffer;
        });
        this.tiles.set(name, buffers);
    }

    defineTile(name, x, y) {
        this.define(name, x * this.width, y * this.height, this.width, this.height);
    }

    defineAnime(name, animation) {
        this.animation.set(name, animation);
    }

    draw(name, ctx, x, y, flip = false) {
        const buffer = this.tiles.get(name)[flip? 1: 0];
        ctx.drawImage(buffer, x, y);
    }

    drawTile(name, ctx, x, y){
        this.draw(name, ctx, x * this.width, y * this.height);
    }
    
    drawAnime(name, ctx, x, y, distance) {
        const animation = this.animation.get(name);
        this.drawTile(animation(distance), ctx, x, y);
    }
}
