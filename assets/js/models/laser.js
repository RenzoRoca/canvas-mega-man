class Laser {

    constructor(ctx, x, y, maxY, maxX) {
        this.ctx = ctx;
        this.x = x;
        this.vx = SPEED;

        this.y = y;
        this.maxY = maxY;
        this.maxX = maxX;
        this.vy = SPEED;

        this.sprite = new Image();
        this.sprite.src = 'assets/src/sprites/laser-bullet.png';
        this.sprite.isReady = false;
        this.sprite.horizontalFrameIndex = 0;
        this.sprite.verticalFrameIndex = 0;
        this.sprite.horizontalFrames = 1;
        this.sprite.verticalFrames = 1;
        this.sprite.onload = () => {
            this.isReady = true;
            this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.horizontalFrames);
            this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.verticalFrames);
            this.width = this.sprite.frameWidth;
            this.height = this.sprite.frameHeight;
        }

        this.drawCount = 0;
    }

    draw() {
        this.ctx.drawImage(
            this.sprite,
            this.sprite.horizontalFrameIndex * this.sprite.frameWidth,
            this.sprite.verticalFrameIndex * this.sprite.frameHeight,
            this.sprite.frameWidth,
            this.sprite.frameHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.drawCount++;
    }

    move(rightPosition) {

        if (rightPosition) {
            this.x += this.vx;
        } else {
            this.x -= this.vx;
        }
    }

    collidesWith(element) {
        return this.x < element.x + element.width &&
            this.x + this.width > element.x &&
            this.y < element.y + element.height &&
            this.y + this.height > element.y;
    }
}