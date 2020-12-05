class Cliff {

    constructor(ctx, x, y, w) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = 100;
        this.vx = -2;
        this.sprite = new Image();
        this.sprite.src = 'assets/src/sprites/cliff.png';
        this.sprite.isReady = false;
        this.sprite.onload = () => {
            this.sprite.isReady = true;
        }
    }

    isReady() {
        return this.sprite.isReady;
    }


    draw() {
        if (this.isReady()) {
            this.ctx.drawImage(this.sprite, this.x, this.y, this.w, this.h);
        }
    }

    move() { this.x -= SPEED; }

    collidesWith(element) {
        return this.x < element.x + element.width &&
            this.x + this.width > element.x &&
            this.y < element.y + element.height &&
            this.y + this.height > element.y;
    }

}