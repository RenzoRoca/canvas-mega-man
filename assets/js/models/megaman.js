class Megaman {

    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.maxX = this.ctx.canvas.width / 2;
        this.minX = 0;
        this.vx = 0;

        this.y = y;
        this.vy = 0;
        this.maxY = this.y;

        this.width = 0;
        this.height = 0;

        this.rightPosition = true;

        this.sprite = new Image();
        this.sprite.src = 'assets/src/sprites/megaman.png';
        this.sprite.isReady = false;
        this.sprite.horizontalFrames = 12;
        this.sprite.verticalFrames = 2;
        this.sprite.horizontalFrameIndex = 0;
        this.sprite.verticalFrameIndex = 1;
        this.sprite.onload = () => {
            this.sprite.isReady = true;
            this.sprite.frameWith = Math.floor(this.sprite.width / this.sprite.horizontalFrames);
            this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.verticalFrames);
            this.width = this.sprite.frameWith;
            this.height = this.sprite.frameHeight;

        }

        this.sprite.drawCount = 0;

        this.movements = {
            up: false,
            right: false,
            left: false
        }
        this.isJumping = false;

        this.canFire = true;
        this.bullets = [];
        this.lifePoints = 7;

        this.sounds = {
            shoot: new Audio('assets/src/sound/MegaBuster.wav')
        }

    }

    onKeyEvent(event) {
        const status = event.type === 'keydown';
        switch (event.keyCode) {
            case KEY_UP:
                this.movements.up = status;
                break;
            case KEY_DOWN:
                this.movements.down = status;
                break;
            case KEY_RIGHT:
                this.movements.right = status;
                break;
            case KEY_LEFT:
                this.movements.left = status;
                break;
            case KEY_FIRE:
                if (this.canFire) {

                    this.animateShoot();

                    if (this.rightPosition) {
                        this.bullets.push(new Laser(this.ctx, this.x + this.width, this.y + 10, this.maxY + this.height, (this.x + this.width) + 80));

                    } else {
                        this.bullets.push(new Laser(this.ctx, this.x - this.width, this.y + 10, this.maxY + this.height, (this.x - this.width) - 80));
                    }

                    this.sounds.shoot.currentTime = 0;
                    this.sounds.shoot.play();
                    this.canFire = false;
                    setTimeout(() => this.canFire = true, 500);
                }
                break;
        }
    }

    clear() {
        this.bullets = this.bullets.filter((bullet) => {
            if (this.rightPosition) {
                if (bullet.x <= bullet.maxX) {
                    return bullet;
                }

            } else {
                if (bullet.x >= bullet.maxX) {
                    return bullet;
                }
            }
        });
    }

    draw() {
        if (this.sprite.isReady) {
            this.ctx.drawImage(
                this.sprite,
                this.sprite.horizontalFrameIndex * this.sprite.frameWith,
                this.sprite.verticalFrameIndex * this.sprite.frameHeight,
                this.sprite.frameWith,
                this.sprite.frameHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
            this.bullets.forEach(bullet => bullet.draw());
            this.sprite.drawCount++;
            this.animate();
        }
    }

    move() {

        this.bullets.forEach(bullet => bullet.move(this.rightPosition));

        if (this.movements.up && !this.isJumping) {
            this.isJumping = true;
            this.vy = -10;
        } else if (this.isJumping) {
            this.vy += GRAVITY;
        }

        if (this.movements.right) {
            this.vx = SPEED;
        } else if (this.movements.left) {
            this.vx = -SPEED;
        } else {
            this.vx = 0;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Check canvas bounds
        if (this.x >= this.maxX) {
            this.x = this.maxX;
        } else if (this.x <= this.minX) {
            this.x = this.minX;
        }
        if (this.y >= this.maxY) {
            this.y = this.maxY;
            this.isJumping = false;
            this.vy = 0;
        }
    }

    animate() {
        if (this.isJumping) {
            this.animateJump();
        } else if (this.movements.right) {
            this.rightPosition = true;
            this.animateSprite(1, 1, 4, MOVEMENT_FRAMES);
        } else if (this.movements.left) {
            this.rightPosition = false;
            this.animateSprite(0, 1, 4, MOVEMENT_FRAMES);
        } else {
            this.resetAnimation();
        }
    }

    animateJump() {
        this.sprite.horizontalFrameIndex = 4;
        if (this.movements.left && this.movements.up) {
            this.sprite.verticalFrameIndex = 0;
        }
        if (this.movements.right && this.movements.up) {
            this.sprite.verticalFrameIndex = 1;
        }
    }

    animateShoot() {

        if (this.movements.up) {
            this.sprite.horizontalFrameIndex = 9;
        } else {
            this.sprite.horizontalFrameIndex = 5;
        }

        if (this.movements.right) {
            this.sprite.verticalFrameIndex = 1;
        }

        if (this.movements.left) {
            this.sprite.verticalFrameIndex = 0;
        }

    }

    resetAnimation() {
        this.sprite.horizontalFrameIndex = 0;
        if (this.movements.left) {
            this.sprite.verticalFrameIndex = 1;
        }
        if (this.movements.right) {
            this.sprite.verticalFrameIndex = 0;
        }
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

    damage(direction) {

        if (direction === 'r') {
            this.x -= 25;
        } else {
            this.x += 25;
        }

        this.animateDamage(direction);
    }

    animateDamage(direction) {

        this.sprite.horizontalFrameIndex = 10;
        this.sprite.verticalFrameIndex = direction === 'r' ? 1 : 0;
    }

    collidesWith(element) {
        return this.x < element.x + element.width &&
            this.x + this.width > element.x &&
            this.y < element.y + element.height &&
            this.y + this.height > element.y;
    }

    checkBulletsCollision(enemy) {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            if (bullet.collidesWith(enemy)) {
                this.bullets.splice(i, 1);
                return true;
            }
        }
    }
}