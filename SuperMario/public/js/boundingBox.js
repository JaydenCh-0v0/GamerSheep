export default class BoundingBox {
    constructor(pos, size, offset) {
        this.pos = pos;
        this.size = size;
        this.offset = offset;
    }

    overlaps(box) {
        return this.top < box.bottom 
            && this.bottom > box.top 
            && this.left < box.right 
            && this.right > box.left;
    }

    // TOP BOUND 
    get top() {
        return this.pos.y + this.offset.y;
    }

    set top(y) {
        this.pos.y = y - this.offset.y;
    }

    // BOTTOM BOUND
    get bottom() {
        return this.pos.y + this.size.y + this.offset.y;
    }

    set bottom(y) {
        this.pos.y = y - (this.size.y + this.offset.y);
    }

    // LEFT BOUND
    get left() {
        return this.pos.x + this.offset.x;
    }

    set left(x) {
        this.pos.x = x - this.offset.x;
    }

    // RIGHT BOUND
    get right() {
        return this.pos.x + this.size.x + this.offset.x;
    }

    set right(x) {
        this.pos.x = x - (this.size.x + this.offset.x);
    }

}
