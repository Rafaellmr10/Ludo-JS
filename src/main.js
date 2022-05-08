import GameOver from './scenes/GameOver.js';
import Menu from './scenes/Menu.js';
import Game from './scenes/Game.js';
import Bootloader from './Bootloader.js';

const config = {
    title: "Ludo",
    version: "1.1.0", // Move Animation finished! :D
    type: Phaser.CANVAS,
    scale: {
        parent: "phaser_container",
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#001100",
    pixelArt: false,
    physics: {
        default: "arcade",
        "arcade": {
            gravity: {
                // y: 500
            }
        }
    },
    banner: {
        hidePhaser: true,
        text: '#000',
        background: ['lightgreen', 'blue', 'red', 'yellow']
    },
    dom: {
        createContainer: true
    },
    scene: [Bootloader, Menu, Game, GameOver]
};

new Phaser.Game(config);