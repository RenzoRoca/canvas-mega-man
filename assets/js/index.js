window.addEventListener('load', () => {
    const game = new Game('game-canvas', () => {

        //if (this.game.endGame) {
        //document.getElementById('game-canvas').style.backgroundImage = "url('assets/src/img/game-over-screen.png')";
        //} else {
        document.getElementById('game-canvas').style.backgroundImage = "url('assets/src/img/game-over-screen.png')";
        //}
    });

    document.addEventListener('keydown', (event) => {
        game.onKeyEvent(event);
    });
    document.addEventListener('keyup', (event) => {
        game.onKeyEvent(event);
    })

    document.addEventListener('keypress', (event) => {
        if (game.drawIntervalId === false) {
            game.restart();
        } else {
            game.start();
        }
    })

});