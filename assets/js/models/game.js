class Game {

    constructor(canvasId, onGameEnd) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.height = 400;
        this.canvas.width = 400;
        this.ctx = this.canvas.getContext('2d');

        this.fps = 1000 / 60;
        this.drawIntervalId = undefined;
        this.enemiesIntervalId = undefined;
        this.floorHeight = this.canvas.height - 100

        this.background = new Background(this.ctx);
        this.cliff = new Cliff(this.ctx, 180, this.floorHeight + 8, 50);
        this.lifeBar = new Lifebar(this.ctx, 10, 48, 20, 100);
        this.lifeMeterY = 53;
        this.lifeMeterHeight = 90;
        this.megaman = new Megaman(this.ctx, 50, this.floorHeight);
        this.enemies = [];
        this.invulnerable = false;

        // Sabemos en que coordenada acaba al nivel 
        this.endLevelXcoor = 2000;

        this.drawEnemyCount = 0;

        const themeAudio = new Audio('assets/src/sound/wood-man-stage.mp3');
        themeAudio.volume = 0.2;
        const megaManDamageAudio = new Audio('assets/src/sound/MegamanDamage.wav');
        megaManDamageAudio.volume = 0.2;
        const enemyDamageAudio = new Audio('assets/src/sound/EnemyDamage.wav');
        enemyDamageAudio.volume = 0.2;
        enemyDamageAudio.volume = 0.2;
        const gameOverAudio = new Audio('assets/src/sound/game-over.mp3');
        gameOverAudio.volume = 0.2;

        this.sounds = {
            theme: themeAudio,
            megaManDamage: megaManDamageAudio,
            enemyDamage: enemyDamageAudio,
            gameOver: gameOverAudio
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
                this.addRandomEnemy();
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

        this.drawEnemyCount = 0;
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

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.megaman.clear();
        this.enemies = this.enemies.filter(enemy => (enemy.x + enemy.width) >= 0);
    }

    draw() {
        this.drawEnemyCount++;
        this.background.draw();
        this.lifeBar.draw();
        this.lifeBar.drawLifeMeter(15, this.lifeMeterY, 10, this.lifeMeterHeight);
        //this.cliff.draw();
        this.megaman.draw();
        this.enemies.forEach(enemy => enemy.draw());
        this.ctx.restore();
    }

    move() {
        if (this.megaman.x >= this.megaman.maxX && this.megaman.movements.right) {
            this.background.move();
            //this.cliff.move();
            this.enemies.forEach(enemy => enemy.move(true));
        } else {
            if (!this.enemiesIntervalId) {

                this.enemiesIntervalId = setInterval(() => {
                    this.enemies.forEach(enemy => enemy.move(false));
                }, 1000);
            }
        }
        this.megaman.move();
    }

    checkCollisions() {

        //this.checkCollisionsWithCliff();

        this.enemies.forEach(enemy => {
            this.checkCollisionsWithMegaman(enemy);
            this.checkBulletsCollision(enemy);
        });

    }

    checkCollisionsWithCliff() {
        if (this.cliff.collidesWith(this.megaman)) {
            this.megaman.vy = -10;
        }
    }


    checkCollisionsWithMegaman(enemy) {
        if (this.megaman.collidesWith(enemy) && !this.invulnerable) {

            this.invulnerable = true;
            setTimeout(() => this.invulnerable = false, 1000);

            this.sounds.megaManDamage.play();
            this.megaman.lifePoints--;

            if (this.megaman.lifePoints < 1) {
                this.end();
            }

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

    checkBulletsCollision(enemy) {

        let collision = false;
        collision = this.megaman.checkBulletsCollision(enemy);

        if (collision) {
            enemy.lifePoints--;
            this.sounds.enemyDamage.play();

            if (enemy.lifePoints < 1) {
                let indexEnemy = this.enemies.indexOf(enemy);
                this.enemies.splice(indexEnemy, 1);
            }
        }
    }

}