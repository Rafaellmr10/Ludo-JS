class SecondaryButton extends Phaser.GameObjects.Container {

	constructor(scene, x, y){
		super(scene, x, y)

		this.scene = scene

		scene.add.existing(this)

        //Random color for SecondaryButton
		this.btnImage = scene.add.image(0, 0, 'button').setScale(0.6)

        this.btnText = scene.add.text(0, 0, '', {
        	fontSize: 29,
            fontFamily: '"Comic Sans MS"',
        	color: 'white',
        }).setOrigin(0.5)

        this.add([this.btnImage, this.btnText])

        let hitAreaBtn = new Phaser.Geom.Rectangle(0 , 0, this.btnImage.width * 0.6, this.btnImage.height * 0.6)
        Phaser.Geom.Rectangle.CenterOn(hitAreaBtn, 0, 0)
        this.setInteractive(hitAreaBtn, Phaser.Geom.Rectangle.Contains);

        // Events
        this.on('pointerover', () => {
            this.btnImage.toggleFlipY()
        })
        this.on('pointerout', () => {
            this.btnImage.toggleFlipY()
        })
        this.on('pointerdown', () => {
            let value = Number(this.btnText._text.split(' ')[0])
            this.setScale(1.2)
            this.scene.data.set('playersNum', value)
        })

        return this
	}

	setText(text) {

		this.btnText.setText(text)
        return this

	}
}

export default SecondaryButton