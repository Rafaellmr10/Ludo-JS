class Board extends Phaser.GameObjects.Image {
	constructor(scene, x, y, sprite) {
		super(scene, x, y, sprite)
		
		this.scene = scene
		this.scene.add.existing(this)
		this.scene.physics.world.enable(this)
		this.setOrigin(0).setScale(0.531)

      	this.squares = {
                  s1: {x: 200, y:260},
                  s2: {x: 240, y:260},
                  s3: {x: 280, y:260},
                  s4: {x: 320, y:260},
                  s5: {x: 360, y:260},
                  s6: {x: 400, y:260},

                  s7: {x: 440, y:220},
                  s8: {x: 440, y:180},
                  s9: {x: 440, y:140},
                  s10: {x: 440, y:100},
                  s11: {x: 440, y:60},
                  s12: {x: 440, y:20},

                  s13: {x: 480, y:20},

                  s14: {x: 520, y:20},
                  s15: {x: 520, y:60},
                  s16: {x: 520, y:100},
                  s17: {x: 520, y:140},
                  s18: {x: 520, y:180},
                  s19: {x: 520, y:220},

                  s20: {x: 560, y:260},
                  s21: {x: 600, y:260},
                  s22: {x: 640, y:260},
                  s23: {x: 680, y:260},
                  s24: {x: 720, y:260},
                  s25: {x: 760, y:260},

                  s26: {x: 760, y:300},

                  s27: {x: 760, y:340},
                  s28: {x: 720, y:340},
                  s29: {x: 680, y:340},
                  s30: {x: 640, y:340},
                  s31: {x: 600, y:340},
                  s32: {x: 560, y:340},

                  s33: {x: 520, y:380},
                  s34: {x: 520, y:420},
                  s35: {x: 520, y:460},
                  s36: {x: 520, y:500},
                  s37: {x: 520, y:540},
                  s38: {x: 520, y:580},

                  s39: {x: 480, y:580},

                  s40: {x: 440, y:580},
                  s41: {x: 440, y:540},
                  s42: {x: 440, y:500},
                  s43: {x: 440, y:460},
                  s44: {x: 440, y:420},
                  s45: {x: 440, y:380},

                  s46: {x: 400, y:340},
                  s47: {x: 360, y:340},
                  s48: {x: 320, y:340},
                  s49: {x: 280, y:340},
                  s50: {x: 240, y:340},
                  s51: {x: 200, y:340},

                  s52: {x: 200, y:300},

                  green: {

				s0: {x: 200, y: 300},
				s1: {x: 240, y: 300},
				s2: {x: 280, y: 300},
				s3: {x: 320, y: 300},
				s4: {x: 360, y: 300},
				s5: {x: 400, y: 300},
				s6: {x: 440, y: 300}

			},

			red: {

				s0: {x: 480, y: 20},
				s1: {x: 480, y: 60},
				s2: {x: 480, y: 100},
				s3: {x: 480, y: 140},
				s4: {x: 480, y: 180},
				s5: {x: 480, y: 220},
				s6: {x: 480, y: 260}

			},

			blue: {

				s0: {x: 760, y: 300},
				s1: {x: 720, y: 300},
				s2: {x: 680, y: 300},
				s3: {x: 640, y: 300},
				s4: {x: 600, y: 300},
				s5: {x: 560, y: 300},
				s6: {x: 520, y: 300}

			},

			yellow: {

				s0: {x: 480, y: 540},
				s1: {x: 480, y: 540},
				s2: {x: 480, y: 500},
				s3: {x: 480, y: 460},
				s4: {x: 480, y: 420},
				s5: {x: 480, y: 380},
				s6: {x: 480, y: 340}

			}
            }
	}	

	createHouseRects(){

            this.houseRects = {}

		let green = this.scene.add.graphics()
		green.fillStyle(0x00ff00)
		this.houseRects.green = green.fillRect(180, 0, 240, 240)

		let red = this.scene.add.graphics()
		red.fillStyle(0xff0000)
		this.houseRects.red = red.fillRect(540, 0, 240, 240)

		let blue = this.scene.add.graphics()
		blue.fillStyle(0x0000ff)
		this.houseRects.blue = blue.fillRect(540, 360, 240, 240)

		let yellow = this.scene.add.graphics()
		yellow.fillStyle(0xffff00)
		this.houseRects.yellow = yellow.fillRect(180, 360, 240, 240)
            
            this.turnTween = this.scene.tweens.add({
                  targets: this.houseRects.green,
                  duration: 500,
                  repeat: -1,
                  alpha: 0.6,
                  yoyo: true
            })

	}

      createPlayersNames(players) {

            this.playerNames = {
                  green: this.scene.add.text(190, 10, '', {
                        backgroundColor: '#9f9'
                  }),

                  red: this.scene.add.text(770, 10, '', {
                        backgroundColor: '#f99'
                  }).setOrigin(1, 0),

                  blue: this.scene.add.text(770, 590, '', {
                        backgroundColor: '#99f'
                  }).setOrigin(1),

                  yellow: this.scene.add.text(190, 590, '', {
                        backgroundColor: '#ff9'
                  }).setOrigin(0, 1)
            }

            players.map((player) => {
                  this.playerNames[player.color].setText(player.name)
                                                .setFontFamily('"Comic Sans MS')
                                                .setFontSize(18)
                                                .setColor('black')
            })

      }
}

export default Board