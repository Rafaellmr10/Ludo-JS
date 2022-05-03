class Button extends Phaser.GameObjects.Container {

	constructor(scene, x, y){
		super(scene, x, y)

		this.scene = scene

        this.error = ''

		scene.add.existing(this)

        //Random color for button
        let randomColor = Phaser.Utils.Array.GetRandom(['green', 'red', 'yellow', 'blue'])

		this.btnImage = scene.add.image(0, 0, randomColor).setScale(0.3)
        this.btnText = scene.add.text(0, 0, '', {
        	fontSize: 18,
            fontFamily: "Comic Sans MS",
        	color: 'white',
        	stroke: '#444',
        	strokeThickness: 4,
        }).setOrigin(0.5)

        this.add([this.btnImage, this.btnText])

        this.setInteractive(new Phaser.Geom.Circle(0, 0, 55), Phaser.Geom.Circle.Contains);

        //Tween
        this.tween = scene.tweens.add({
            targets: this,
            duration: 300,
            repeat: -1,
            repeatDelay: 2000,
            yoyo: true,
            scaleX: 0
        })
        scene.tweens.add({
            targets: this,
            duration: 500,
            repeat: -1,
            yoyo: true,
            alpha: 0.7
        })

        // Events
        this.on('pointerover', () => {
            this.tween.pause()
            this.setScale(1.3)
        })
        this.on('pointerout', () => {
            this.tween.resume()
            this.setScale(1)
        })
	}

	setText(text) {

		this.btnText.setText(text)

        return this

	}

	setSceneObj(scene){

		this.on('pointerdown', () => {
			this.setScale(0.9)
            setTimeout(() => {
                this.scene.scene.start(scene)
            }, 10);
                
            
		})

        return this

	}

	setColor(color) {

		this.btnImage.setTexture(color)

        return this

	}

}

export default Button