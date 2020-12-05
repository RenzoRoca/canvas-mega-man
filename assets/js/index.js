window.addEventListener('load', () => {
    const game = new Game('game-canvas', () => {

        document.getElementById('game-canvas').style.backgroundImage = "url('assets/src/img/game-over-screen.png')";
        document.getElementById('game-canvas').style.background('');
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