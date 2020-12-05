class Lifebar {

    constructor(ctx, x, y, w, h) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = w
        this.h = h
    }

    clear() {}

    draw() {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(
            this.x,
            this.y,
            this.w,
            this.h
        );
    }

    drawLifeMeter(x, y, w, h) {
        this.ctx.fillStyle = "#f1e346";
        this.ctx.fillRect(x, y, w, h)
    }
}