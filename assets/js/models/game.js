class Game {

    constructor(canvasId, onGameEnd) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.height = 400;
        this.canvas.width = 400;
        this.ctx = this.canvas.getContext('2d');

        this.fps = 1000 / 60;
        this.drawIntervalId = undefined;
        this.enemiesIntervalId = undefined;
        this.woodmanIntervalId = undefined;
        this.floorHeight = this.canvas.height - 100

        this.background = new Background(this.ctx);
        this.lifeBar = new Lifebar(this.ctx, 10, 48, 20, 100);
        this.lifeMeterY = 53;
        this.lifeMeterHeight = 90;
        this.megaman = new Megaman(this.ctx, 50, this.floorHeight);
        this.woodman = new Woodman(this.ctx, this.canvas.width - 70, this.floorHeight + 5, 'assets/src/sprites/woodman.png', 1, 7, 10, 10, 20);
        this.enemies = [];
        this.cliffs = [
            new Cliff(this.ctx, this.megaman.x + 1000, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 1500, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 2000, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 2200, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 2300, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 2600, this.floorHeight + 30, 100),
            new Cliff(this.ctx, this.megaman.x + 2800, this.floorHeight + 30, 100),
            new Cliff(this.ctx, this.megaman.x + 3000, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 3100, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 3200, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 3300, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 3400, this.floorHeight + 30, 100)

        ];
        this.invulnerable = false;
        this.countCoordinate = 0;
        this.endLevelXcoor = 2000;

        this.drawEnemyCount = 0;
        this.drawCliffCount = 0;

        const themeAudio = new Audio('assets/src/sound/wood-man-stage.mp3');
        themeAudio.volume = 0.2;
        const megaManDamageAudio = new Audio('assets/src/sound/MegamanDamage.wav');
        megaManDamageAudio.volume = 0.2;
        const enemyDamageAudio = new Audio('assets/src/sound/EnemyDamage.wav');
        enemyDamageAudio.volume = 0.2;
        enemyDamageAudio.volume = 0.2;
        const gameOverAudio = new Audio('assets/src/sound/game-over.mp3');
        gameOverAudio.volume = 0.2;
        const bossAudio = new Audio('assets/src/sound/Boss.mp3');
        bossAudio.volume = 0.2;
        const stageClearAudio = new Audio('assets/src/sound/StageClear.mp3');
        stageClearAudio.volume = 0.2;

        this.endGame = false;

        this.sounds = {
            theme: themeAudio,
            megaManDamage: megaManDamageAudio,
            enemyDamage: enemyDamageAudio,
            gameOver: gameOverAudio,
            boss: bossAudio,
            stageClear: stageClearAudio
        }

        this.onGameEnd = onGameEnd;
    }

    start() {
        if (!this.drawIntervalId) {
            this.sounds.theme.play();
            this.drawIntervalId = setInterval(() => {
                this.clear();
                this.move();
                this.draw();
                this.checkCollisions();
                if (!this.woodman.spawned) {
                    this.addRandomEnemy();
                }
                //this.addRandomCliff();
            }, this.fps)
        }
    }

    stop() {
        clearInterval(this.drawIntervalId);
        this.drawIntervalId = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    restart() {
        this.background = new Background(this.ctx);
        this.lifeBar = new Lifebar(this.ctx, 10, 48, 20, 100);
        this.lifeMeterY = 53;
        this.lifeMeterHeight = 90;
        this.megaman = new Megaman(this.ctx, 50, this.floorHeight);
        this.enemies = [];
        this.cliffs = [
            new Cliff(this.ctx, this.megaman.x + 1000, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 1500, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 2000, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 2200, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 2300, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 2600, this.floorHeight + 30, 100),
            new Cliff(this.ctx, this.megaman.x + 2800, this.floorHeight + 30, 100),
            new Cliff(this.ctx, this.megaman.x + 3000, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 3100, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 3200, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 3300, this.floorHeight + 30, 50),
            new Cliff(this.ctx, this.megaman.x + 3400, this.floorHeight + 30, 100)
        ];
        this.start();
    }

    end() {
        this.sounds.theme.pause();
        this.sounds.gameOver.play();
        this.stop();
        this.onGameEnd();
    }

    onKeyEvent(event) {
        this.megaman.onKeyEvent(event);
        this.background.onKeyEvent(event);
        this.enemies.forEach(enemy => enemy.onKeyEvent(event));
    }

    addRandomEnemy() {

        if (this.drawEnemyCount % 50 === 0 && this.megaman.movements.right) {

            let nEnemy = Math.floor(Math.random() * 6) + 1;
            let enemy;

            switch (nEnemy) {
                case 1:
                case 2:
                    enemy = new BubbleBat(this.ctx, this.canvas.width, this.floorHeight - 50, 'assets/src/sprites/bat.png', 1, 5, 30, 3);
                    break;
                case 3:
                case 4:
                case 5:
                    enemy = new Enemy(this.ctx, this.canvas.width, this.floorHeight + 16, 'assets/src/sprites/met.png', 2, 4, 10, 3);
                    break;
                case 6:
                    enemy = new Enemy(this.ctx, this.canvas.width, this.floorHeight - 5, 'assets/src/sprites/kukku.png', 1, 3, 40, 3);
                    break;
            }

            this.drawEnemyCount = 0;
            this.enemies.push(enemy);
        }
    }

    addRandomCliff() {
        if (this.drawCliffCount % 50 === 0 && this.megaman.movements.right) {
            let cliff = new Cliff(this.ctx, 200, this.floorHeight, 50);
            this.drawCliffCount = 0;
            this.cliffs.push(cliff);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.megaman.clear();
        this.woodman.clear();
        this.enemies = this.enemies.filter(enemy => (enemy.x + enemy.width) >= 0);
    }

    draw() {
        this.drawEnemyCount++;
        this.drawCliffCount++;
        this.background.draw();
        this.lifeBar.draw();
        this.lifeBar.drawLifeMeter(15, this.lifeMeterY, 10, this.lifeMeterHeight);
        this.cliffs.forEach(cliff => cliff.draw());
        this.megaman.draw();

        if (this.woodman.spawned) {
            this.woodman.draw();
        }

        this.enemies.forEach(enemy => enemy.draw());
        this.ctx.restore();
    }

    move() {
        if (this.countCoordinate >= this.endLevelXcoor && !this.endGame) {
            this.woodman.spawned = true;
            this.enemies = [];
            this.sounds.theme.pause();
            this.sounds.boss.play();
        }

        if (this.megaman.x >= this.megaman.maxX && this.megaman.movements.right) {
            this.background.move();
            this.cliffs.forEach(cliff => cliff.move());
            this.enemies.forEach(enemy => enemy.move(true));
            this.countCoordinate += 2;
        } else {
            if (!this.enemiesIntervalId) {

                this.enemiesIntervalId = setInterval(() => {
                    this.enemies.forEach(enemy => enemy.move(false));
                }, 1000);
            }
        }

        if (this.woodman.spawned) {
            if (!this.woodmanIntervalId) {
                this.woodmanIntervalId = setInterval(() => {
                    this.woodman.attack();
                }, 2000);
            }

            if (this.woodman.bullets.length > 0) {
                this.woodman.moveLeaves();
            }
        }

        this.megaman.move(this.megaman.isFalling);
    }

    checkCollisions() {
        this.checkCollisionsWithCliff();
        this.enemies.forEach(enemy => {
            this.checkCollisionsWithMegaman(enemy);
            this.checkBulletsCollision(enemy);
        });

        if (this.woodman.spawned) {
            this.checkBulletsCollision(this.woodman);
        }


        if (this.woodman.spawned) {
            this.woodman.bullets.forEach(bullet => this.checkCollisionsWithMegaman(bullet));
            this.woodman.rainLeaves.forEach(bullet => this.checkCollisionsWithMegaman(bullet));
        }

    }

    checkCollisionsWithCliff() {
        this.cliffs.forEach(cliff => {
            if (cliff.collidesWith(this.megaman)) {
                this.megaman.isJumping = true;
                this.megaman.isFalling = true;
                this.megaman.animateJump();
                this.megaman.vy += 1;
                setTimeout(() => this.end(), 1000);
            }
            this.enemies.forEach(enemy => {
                if (cliff.collidesWith(enemy)) {
                    let indexEnemy = this.enemies.indexOf(enemy);
                    this.enemies.splice(indexEnemy, 1);
                }
            });
        });
    }

    checkCollisionsWithMegaman(enemy) {
        if (this.megaman.collidesWith(enemy) && !this.invulnerable) {

            this.invulnerable = true;
            setTimeout(() => this.invulnerable = false, 1000);

            this.sounds.megaManDamage.play();
            this.megaman.lifePoints--;

            if (this.megaman.lifePoints < 1) {
                this.countCoordinate = 0;
                this.sounds.boss.pause();
                this.woodman.spawned = false;
                this.end();
            } else {
                this.lifeMeterY += 13;

                if (this.lifeMeterHeight - 13 > 0) {
                    this.lifeMeterHeight -= 13;
                }

                this.lifeBar.drawLifeMeter(15, this.lifeMeterY, 10, this.lifeMeterHeight);
                if (this.megaman.x > enemy.x) {
                    return this.megaman.damage('l');
                }
                return this.megaman.damage('r');
            }
        }
    }

    checkBulletsCollision(enemy) {

        let collision = false;
        collision = this.megaman.checkBulletsCollision(enemy);

        if (collision) {
            enemy.lifePoints--;
            this.sounds.enemyDamage.play();

            if (enemy.lifePoints < 1) {
                let indexEnemy = this.enemies.indexOf(enemy);
                this.enemies.splice(indexEnemy, 1);
                if (this.woodman.spawned) {
                    this.sounds.boss.pause();
                    this.sounds.stageClear.play();
                    this.woodman.spawned = false;
                    this.endGame = true;
                    setTimeout(() => this.end(), 4000);
                }
            }
        }
    }

}