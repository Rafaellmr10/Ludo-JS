class Tokens extends Phaser.Physics.Arcade.Group {
	constructor(physicsWorld, scene) {
		super(physicsWorld, scene)
		
		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.world.enable(this)

		console.log(this)
		
	}
	newToken (x, y, name, starPos, idxTexture){
		let token = this.create(x, y, 'tokens', idxTexture).setScale(0.4).setInteractive()

		token.setName(name)

		token.live = false 
		token.pos = starPos
		token.steps = 0
		token.finalSteps = 0
		token.up = true
		token.childs = []
		token.inicialFrame = idxTexture
		this.color = name

		token.house = {x: x, y: y}

		token.on('pointerdown', () => {
			this.scene.checkTurn(token)

			this.scene.teams.map((team) => {
				team.clicked = false
			})
			this.clicked = true

		})

		this.scene.events.on('update', () => {
			/* Se verifica si hay piezas montadas para eliminiar una y la cambiar
               la textura de la otra (simulando que esta montada) */

            if (token.childs.length >= 1) {
                token.setFrame(token.childs.length + token.inicialFrame)
            }else{
                token.setFrame(token.inicialFrame)
            }
		})

		token.standAnim = this.scene.tweens.timeline({
            targets: token,
            loop: -1,
            duration: 100,
            loopDelay: 200,
            tweens: [
                {
                    rotation: -0.2
                },
                {
                    rotation: 0.2
                },
                {
                    rotation: -0.1
                },
                {
                    rotation: 0.1
                },
                {
                	rotation: 0
                }          
            ]          
        })

        token.standAnim.pause()

        
	}

	update() {
		console.log('aqui')
		this.children.iterate((token) => {
			
		})
	}

	startGame(x, y, name, starPos, idxTexture) {

		this.newToken(x, y, name, starPos, idxTexture)
		this.newToken(x - 40, y + 40, name, starPos, idxTexture)
		this.newToken(x + 40, y + 40, name, starPos, idxTexture)
		this.newToken(x, y + 80, name, starPos, idxTexture)
	}

	canMove(stopAll) {

		//Se detienen todas las animaciones de las fichas
		if (stopAll) {
			this.scene.everyTokens.map((token) => {

				token.setRotation(0)
				token.standAnim.pause()

			})
			return
		}

		if(this.turn){

			this.children.iterate((token) => {

				// Si la ficha esta viva, play!
				if (token.live && token.finalSteps != 6) {

					token.standAnim.play()
					token.standAnim.resume()

				}

				// Si la ficha esta en casa y el dado arroja 6 o 1, play!
				let diceValue = this.scene.dice.getData('value')
				if (!token.live && (diceValue == 6 || diceValue == 1)) {

					token.standAnim.play()
					token.standAnim.resume()

				}

			})

		}

	}
}

export default Tokens