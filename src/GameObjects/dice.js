class Dice extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, sprite, frame) {
		super(scene, x, y, sprite, frame)
		
		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.world.enable(this)
		this.setScale(0.6).setInteractive()

		this.anim()
		this.setDataEnabled()
		this.setData('rolled', false)
		this.setData('attemps', 3)
		this.setData('value', 0)
		this.setName('dice')

		this.on('pointerdown', () => {
			if(!this.data.get('rolled')) {
				this.anims.play('rollDice')
				this.scene.diceSound.play()
				this.setData('value', 6)//Phaser.Math.Between(1, 6))
				this.setData('rolled', true)
			}
		})

		this.on('animationcomplete', ()=>{
			this.scene.diceSound.stop()
			this.setTexture('dice', 31 + this.data.get('value'))
			
			this.scene.teams.map((team) => {
				team.canMove()
			})

			if (!this.checkLives() && this.data.get('value') != 6 && this.data.get('value') != 1) {
				
				this.setData('rolled', false)
				if (this.getData('attemps') == 1) {

					let next = this.scene.getTurn(true)
	                this.scene.setTurn(next)//Siguiente que posee el turno

					this.setData('attemps', 3)
					
				}else {
					this.data.values.attemps--
				}
			}else {

				this.setData('attemps', 3)
				
			}
		})

		this.on('changedata-rolled', (parent, value) => {
			// Tween que indica que el dado se puede lanzar
			if(value){
				this.tween.restart().pause()
			}else {
				this.tween.resume()
			}

		})
	}
	anim() {

		this.anims.create({
			key: 'rollDice',
			frames: this.anims.generateFrameNumbers('dice', {start: 0, end: 31}),
			repeat: 0,
			frameRate: 60

		})

		this.tween = this.scene.tweens.add({
			targets: this,
			duration: 350,
			ease: 'Power1',
			scale: 0.7,
			yoyo: true,
			repeat: -1
		})
	}

	checkLives() {
		let lives = false
		let turn = this.scene.getTurn()

		turn.children.iterate((token) => {
			if(token.live && token.finalSteps != 6){
				lives = true
			}
		})
		return lives

	}

}

export default Dice