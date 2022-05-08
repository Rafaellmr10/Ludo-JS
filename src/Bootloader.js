
class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader'); 
    }

    preload() {
        console.log('Bootloader');
        this.load.setPath('./assets/sprites');

        this.load.image('board')
                .image('green')
                .image('red')
                .image('blue')
                .image('yellow')
                .image('logo')
                .image('button')
                .spritesheet('dice', 'dice.png' ,{frameWidth: 201.5, frameHeight: 208})
                .spritesheet('tokens', 'tokens.png' ,{frameWidth: 99, frameHeight: 100})

        this.load.audio('rollSound', '../sound/roll.wav')


        this.load.on('complete', () => {
            console.log('Load complete');  
            // this.scene.start('Menu')          
        });
    }

    create() {
        this.data.set('puntos', 3)
        this.logo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo').setAlpha(0)

        this.tweens.add({
            targets: this.logo,
            totalDuration: 500,
            yoyo: true,
            alpha: 1,
            onComplete: () => {
                this.scene.start('Menu')
            }
        })
    }
}
export default Bootloader;