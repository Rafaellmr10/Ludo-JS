import Button from '../GameObjects/button.js'
import SecondaryButton from '../GameObjects/secondaryButton.js'

class Menu extends Phaser.Scene {
    constructor() {
        super({key: 'Menu'});
    }

    init() {
        console.log('Scene: Menu');

        this.data.set('playersNum', 0)
        this.data.set('players', [])
    }

    create() {

        let centerX = this.game.config.width/2
        let centerY = this.game.config.height/2
        let textures = ['green', 'red', 'blue', 'yellow']

        //Background
        this.add.image(centerX, centerY, 'board').setScale(0.7)
        this.add.graphics()
                .fillStyle(0x000000)
                .fillRect(20, 15, centerX * 1.9, centerY * 1.9).setAlpha(0.5)

        // Logo
        this.add.image(centerX, centerY - 200, 'logo').setScale(0.7)

        // Select Players Numbers
        this.selectPlayersBtn = [
            new SecondaryButton(this, centerX, centerY - 50).setText('2 Players'),
            new SecondaryButton(this, centerX, centerY + 50).setText('3 Players'),
            new SecondaryButton(this, centerX, centerY + 150).setText('4 Players')
        ]        
        
        // Back button
        this.btnBack = new Button(this, centerX - 100, centerY + 200)
        this.btnBack.setText('BACK').setSceneObj('Menu').setVisible(false)  
        this.btnBack.tween.pause()

        // Error Text for colors or names repeated
        this.errorText = this.add.text(centerX, centerY * 1.5, '', {
            fontSize: 25,
            fontFamily: '"Comic Sans MS"',
            stroke: 'white',
            strokeThickness: 3  
        }).setOrigin(0.5, 1)

        // Start button
        this.btn = new Button(this, centerX + 100, centerY + 200)
        this.btn.setText('START!').setSceneObj('Game').setVisible(false)

        // Inputs for player names
        this.playersNamesInput = this.add.dom(centerX - 130, centerY - 105, 'div').setScale(1.5).setOrigin(0)
        
        // Buttons for select player color
        this.selectColorBtns = [
            this.add.image(centerX + 110, centerY - 90, 'green').setScale(0.15).setInteractive().setVisible(false),
            this.add.image(centerX + 110, centerY - 25, 'red').setScale(0.15).setInteractive().setVisible(false),
            this.add.image(centerX + 110, centerY + 35, 'blue').setScale(0.15).setInteractive().setVisible(false),
            this.add.image(centerX + 110, centerY + 95, 'yellow').setScale(0.15).setInteractive().setVisible(false)
        ]

        // Events for select color buttons
        this.selectColorBtns.map((btn) => {
            btn.on('pointerdown', () => {
                let idx = textures.indexOf(btn.texture.key)
                idx = (idx == 3)? 0 : idx + 1

                btn.setTexture(textures[idx]) 
            })
            btn.on('pointerover', () => {
                btn.setScale(0.14)
            })

            btn.on('pointerout', () => {
                btn.setScale(0.15)
            })
        })

        // Events for playersNum
        this.data.events.on('changedata-playersNum', (parent, value) => {
            
            let playersNum = this.data.get('playersNum')
            if(playersNum > 0){

                let inputs = ''

                for (let i = 1; i <= playersNum; i++) {
                    inputs += `<input type="text" placeHolder="Player Name" style="font-family: 'Comic Sans MS'; width: 140px"><br><br>`
                }

                this.playersNamesInput.setHTML(inputs)


                for (let i = 0; i < playersNum; i++) {
                    this.selectColorBtns[i].setVisible(true)
                }

                // Show elements 
                this.playersNamesInput.setVisible(true)
                this.selectPlayersBtn.map((btn) => {
                    btn.setVisible(false)
                })
                this.btn.setVisible(true)
                this.btnBack.setVisible(true)

            }

        })

    }

    update(time, delta) {

        let names = document.querySelectorAll('input')
        let colors = this.selectColorBtns
        
        for (let i = 0; i < names.length; i++){
            this.data.values.players[i] = {
                name: (names[i].value)? names[i].value : 'The ' + colors[i].texture.key + 's',
                color: colors[i].texture.key
            }

        }

        // Set error text
        for (let i in this.data.values.players){

            // Colors repeated
            let errorColor = 0
            // Names repeated
            let errorName = 0

            for (let i2 in this.data.values.players){

                let p1 = this.data.values.players[i]
                let p2 = this.data.values.players[i2]

                if (p1.color == p2.color) {
                    errorColor++
                }
                if (p1.name.toLowerCase() == p2.name.toLowerCase()) {
                    errorName++
                }
            
            }
            if (errorColor > 1 || errorName > 1) {
                this.errorText.setText('The names or colors are repeated!')
                this.errorText.setColor(this.data.values.players[i].color)
                this.btn.disableInteractive()
                return
            }else{
                this.errorText.setText('')
                this.btn.setInteractive()
            }

        }    

    }
}

export default Menu;
