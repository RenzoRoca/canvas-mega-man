class Cliff {

    constructor(ctx, x, y, width) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 100;
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
            this.ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
    }

    move() { this.x -= SPEED; }

    collidesWith(element) {
        return this.x < element.x + (element.width / 2) &&
            this.x + (this.width / 2) > element.x &&
            this.y < element.y + element.height &&
            this.y + this.height > element.y;
    }

}