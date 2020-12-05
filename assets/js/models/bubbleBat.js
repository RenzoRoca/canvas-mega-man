class BubbleBat {

    constructor(ctx, x, y, sprite, verticalFrames, horizontalFrames, speed, lifePoints, frequency = 30, horizontalFrameIndex = 0, verticalFrameIndex = 0, drawCount = 0, initFrameDraw = 0) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;

        this.sprite = new Image();
        this.sprite.src = sprite;
        this.sprite.isReady = false;
        this.sprite.verticalFrames = verticalFrames;
        this.sprite.horizontalFrames = horizontalFrames;
        this.speed = speed;
        this.lifePoints = lifePoints;
        this.frequency = frequency;
        this.horizontalFrameIndex = horizontalFrameIndex;
        this.verticalFrameIndex = verticalFrameIndex;
        this.sprite.drawCount = drawCount;

        this.initFrameDraw = initFrameDraw;

        this.sprite.onload = () => {
            this.sprite.isReady = true;
            this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.horizontalFrames);
            this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.verticalFrames);
            this.width = this.sprite.frameWidth;
            this.height = this.sprite.frameHeight;
        }

        this.movements = {
            right: false
        }
    }

    onKeyEvent(event) {
        const state = event.type === 'keydown';
        switch (event.keyCode) {
            case KEY_RIGHT:
                this.movements.right = state;
                break;
        }
    }

    draw() {
        if (this.sprite.isReady) {
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
            this.sprite.drawCount++;

            if (this.initFrameDraw < this.sprite.horizontalFrames) {
                this.initFrameDraw++;
            } else {
                this.initFrameDraw = 0;
            }

            this.animate(this.initFrameDraw);
        }
    }

    animate(horizontalFrameIndex) {
        this.animateSprite(this.verticalFrameIndex, horizontalFrameIndex, this.sprite.horizontalFrames, this.frequency);
    }

    resetAnimation() {
        this.sprite.horizontalFrameIndex = 0;
        this.sprite.verticalFrameIndex = 1;
    }

    animateSprite(initialVerticalIndex, initialHorizontalIndex, segments, frequency) {

        if (this.sprite.verticalFrameIndex !== initialVerticalIndex) {
            this.sprite.verticalFrameIndex = initialVerticalIndex;
            this.sprite.horizontalFrameIndex = initialHorizontalIndex;
        } else if (this.sprite.drawCount % frequency === 0) {
            this.sprite.horizontalFrameIndex = (this.sprite.horizontalFrameIndex + 1) % segments;
            this.sprite.drawCount = 0;
        }
    }

    move(megaManMove) {

        if (megaManMove) {
            this.x -= SPEED;
        } else {

            this.x -= Math.floor(Math.random() * this.speed);
            this.y -= Math.floor(Math.random() * this.speed);
            this.x += Math.floor(Math.random() * this.speed);
            this.y += Math.floor(Math.random() * this.speed);
        }
    }
}