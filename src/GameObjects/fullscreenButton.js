class FullscreenButton extends Phaser.GameObjects.Image {

	constructor(scene, x, y){

		//Texture for the button
		let t = (scene.scale.fullscreen.active)? 'fullscreenBtn2' : 'fullscreenBtn1'
		super(scene, x, y, t)

		scene.add.existing(this)
		this.setInteractive()

		this.on('pointerup', () => {

			this.setScale(0.9)

			scene.scale.toggleFullscreen()		
		})

		scene.scale.on('enterfullscreen', () => {
			scene.textures.setTexture(this, 'fullscreenBtn2')
		})

		scene.scale.on('leavefullscreen', () => {
			scene.textures.setTexture(this, 'fullscreenBtn1')
		})

		this.on('pointerover', () => {
			this.setScale(1.1)
		})

		this.on('pointerout', () => {
			this.setScale(1)
		})

	}

}
export default FullscreenButton