import Button from '../GameObjects/button.js'

class GameOver extends Phaser.Scene {
    constructor() {
        super({key: 'GameOver'});
    }

    init() {
        console.log('Scene: GameOver');
    }

    create() {
        let centerX = this.game.config.width/2
        let centerY = this.game.config.height/2

        this.add.image(centerX, centerY, 'board').setScale(0.7)

        this.add.graphics()
                .fillStyle(0x000000)
                .fillRect(20, 15, centerX * 1.9, centerY * 1.9).setAlpha(0.5)

        this.winner = this.scene.get('Game').winner

        this.add.text(centerX, centerY, this.winner.name.toUpperCase() + ', WINS!!',{
            fontSize: 50,
            fontFamily: '"C omic Sans MS"',
            color: 'black',
            backgroundColor: this.winner.color
        }).setOrigin(0.5)

        this.btn = new Button(this, centerX, centerY + 150)
        this.btn.setText('MENU')
        this.btn.setSceneObj('Bootloader')
        this.btn.setColor(this.winner.color)

    }

    update(time, delta) {

    }
}

export default GameOver;
