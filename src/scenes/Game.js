import Tokens from '../GameObjects/tokens.js'
import Dice from '../GameObjects/dice.js'
import Board from '../GameObjects/board.js'
import Button from '../GameObjects/button.js'
import FullscreenButton from '../GameObjects/fullscreenButton.js'

class Game extends Phaser.Scene {
    constructor() {
        super({key: 'Game'});
    }

    init() {
        console.log('Scene: Game');

        //this.continue = true // Se usa para evitar un bug al momento de detectar colisiones
        
    }

    create() {
        this.board = new Board(this, 180, 0, 'board')
        this.zoom = true

        this.backBtn = new Button(this, 90, this.game.config.height - 150)
        this.backBtn.setText('BACK')
        this.backBtn.setSceneObj('Menu')
        this.backBtn.tween.pause()

        // Boton para actvar o desactivar el zoom, 
        // cuando esta activado se inicia al mover una ficha
        this.zoomBtn = new Button(this, 90, this.game.config.height - 300)
        this.zoomBtn.setText('Zoom: On')
        this.zoomBtn.tween.pause()
        this.zoomBtn.setColor('green')
        this.zoomBtn.on('pointerdown', () => {
            this.zoom = !this.zoom

            if(!this.zoom) {
                this.zoomBtn.setText('Zoom: Off')
                this.zoomBtn.setColor('red')
            }else {
                this.zoomBtn.setText('Zoom: On')
                this.zoomBtn.setColor('green')
            }
        })


        new FullscreenButton(this, 90, this.game.config.height - 50)

        this.dice = new Dice(this, 90, 90, 'dice', Phaser.Math.Between(32, 37))
        this.diceSound = this.sound.add('rollSound', {loop: true})

        this.createTeams()
        this.everyTokens = []

        // El turno se elije de forma aleatoria
        this.setTurn(this.teams[Phaser.Math.Between(0, this.teams.length - 1)])   

        this.physics.add.collider(this.teams, this.teams, this.checkColider, null, this)
         
    }

    update(time, delta) {

        // Se acutaliza el array que contiene todas las fichas
        this.teams.map((team) => {

            team.children.iterate((token) => {

                if(!this.everyTokens.includes(token)) {

                    this.everyTokens.push(token)

                }

            })
        })


        this.teams.map((team) => { 

            let winers = 0
            team.children.iterate((token) => {

                //Se verifica cuantas fichas de x color han llegado a la meta, si son mas de 4 GANA!
                if (token.win) {

                    winers++

                    winers += token.childs.length

                }
                
                if (winers >= 4) {
                    this.gameOver(team)
                }

            })  
        })
    }

    createTeams() {

        let menu = this.scene.get('Menu')
        let playersNum = menu.data.get('playersNum')
        let players = menu.data.get('players')

        // Colores de jugadores
        let playersColorsArray = players.map((player) => {
            return player.color
        })


        this.teams = []

        this.green = new Tokens(this.physics.world, this)
        this.green.startGame(300, 80, 'green', 2, 0)

        this.red = new Tokens(this.physics.world, this)
        this.red.startGame(660, 80, 'red', 15, 4)

        this.blue = new Tokens(this.physics.world, this)
        this.blue.startGame(660, 440, 'blue', 28, 8)

        this.yellow = new Tokens(this.physics.world, this)
        this.yellow.startGame(300, 440, 'yellow', 41, 12)

        this.teams = [this.green, this.red, this.blue, this.yellow]

        this.board.createHouseRects()
        this.board.createPlayersNames(players)

        // Eliminacion de colores no selecionados y Asignacion de nombres
        this.teams = this.teams.filter((team) => {
            if (!playersColorsArray.includes(team.color)) {

                team.clear(true, true)
                team.destroy()

            }else{
                let p = players.find((player) => {
                   return player.color == team.color
                })
                team.setName(p.name)
                return team
            }
        })
    }

    // Cambiar turno
    setTurn(next){

        this.teams.map((team) => {
            team.turn = false
            this.board.houseRects[team.color].setAlpha(0)
        })

        this.board.turnTween.data[0].target = this.board.houseRects[next.color]

        next.turn = true
    }

    // Otener el turno actual (next == false), o el siguiente (next == true)
    getTurn(next) {

        let current = this.teams.find((team) => {
            return team.turn
        })

        let idxNext = this.teams.indexOf(current)
        idxNext = (idxNext == this.teams.length - 1)? 0 : idxNext + 1

        return (next)? this.teams[idxNext] : current

    }

    checkTurn(token) {

        if(this[token.name].turn && this.dice.getData('rolled')) {

            // Determina si el dado arrojo 1 o 6
            let comodin = (this.dice.getData('value') == 6 || this.dice.getData('value') == 1)

            if(token.live){
                /*
                    Si la posicion de la ficha es mayor a 52 a newPos se le resta 52, ya que solo hay 52 posiciones, 
                    Si no, se establece la nueva posicion (posicion actual + valor del dado),
                 */
                let newPos = token.pos + this.dice.getData('value')
                newPos =  (newPos > 52)? newPos - 52: newPos

                let newSteps = token.steps + this.dice.getData('value')
                if (token.steps > 51) {newPos = null}

                this.move(token, token.road['s' + newSteps], newPos)

                if (!comodin) {
                    //Cambio de turno al siguiente
                    let next = this.getTurn(true)
                    this.setTurn(next)
                }

            }else if(comodin) {
                this.move(token, token.road.s1, token.pos)
                token.live = true
                token.steps++
            }
        }
    }

    checkColider(token, target){

        //Aseguramos de que TOKEN sea la ficha movida (clicked)
        if (!this[token.name].clicked && this[target.name].clicked) {
            let change = token
            token = target
            target = change
        }
        
        if(token.name == target.name && token.pos == target.pos){
            
            //Montar
            if (token.live && target.live && this[token.name].clicked) {

                target.childs.push(token)
                if (token.childs.length >= 1) {
                    for (let i in token.childs) {
                        target.childs.push(token.childs[i])
                    }
                }

                token.live = false
                Phaser.Utils.Array.Remove(this.everyTokens, token)
                token.destroy(true) 

                this.setTurn(this[token.name])
            }
        }else if (token.pos == target.pos){

            //Matar a otra(s) ficha(s)
            if ((this[token.name].clicked) && (!this.isSecure(target) || token.steps == 1)) {
                //Se repite el turno
                this.setTurn(this[token.name])   

                this.killToken(target)
            }        
        }     
    }

    isSecure(token) {

        let secure = false
        if ((token.live) && (token.pos == 2 || token.pos == 15 || token.pos == 28 || token.pos == 41)) {

            secure = true

        }
        return secure
    }

    killToken(token){
        // Se crean nuevas fichas remplazando la capturada con sus hijos
        if (token.childs.length >= 1) {
            for (let i in token.childs){
                let t = token.childs[i]
                this[token.name].newToken(t.house.x, t.house.y, t.name, t.inicialPos, t.inicialFrame)
            }
        }
        this[token.name].newToken(token.house.x, token.house.y, token.name, token.inicialPos, token.inicialFrame)
        
        //Se elimina por completo la ficha capturada    
        token.live = false 
        Phaser.Utils.Array.Remove(this.everyTokens, token)
        token.destroy(true)
    }

    move(token, square, newPos) {

        let tweens = []
        if (!token.live){
            tweens = [{
                duration: 1500,
                ease: 'power1',
                x: square.x,
                y: square.y
            }]
        }else {

            let steps = this.dice.getData('value')
            for (let i = 1; i <= steps; i++) {

                if (token.steps + 1 > 57) {
                    token.up = false
                }
                if (token.steps - 1 < 52){
                    token.up = true
                }

                if (token.up) {
                    token.steps++
                    tweens.push({
                        duration: 500,
                        ease: 'power1',
                        x: token.road['s'+ (token.steps)].x,
                        y: token.road['s'+ (token.steps)].y 
                    })
                }else {
                    token.steps--
                    tweens.push({
                        duration: 500,
                        ease: 'power1',
                        x: token.road['s'+ (token.steps)].x,
                        y: token.road['s'+ (token.steps)].y
                    })
                }
                
            }
            
        }

        let timeline = this.tweens.timeline({
            targets: token,
            ease: 'Power1',
            tweens: tweens,
            onStart: () => {
                token.disableInteractive()

                if(this.zoom){
                    this.cameras.main.zoomTo(2, 500)
                    this.cameras.main.startFollow(token)
                }
            },
            onComplete: () => {
                token.pos = newPos

                this.cameras.main.zoomTo(1)
                this.cameras.main.stopFollow()
                this.cameras.main.pan(this.game.config.width/2, this.game.config.height/2)

                if(token.live) {token.setInteractive()}

                this.dice.setData('rolled', false)

                this[token.name].canMove(true)

                this.checkOrder()
                
                // Si la ficha esta en la meta pierde su interactividad ya que debe quedarse ahi
                if (token.steps == 57) {
                    token.win = true
                    token.disableInteractive()
                    this.setTurn(this[token.name])
                }
            }
        }) 
    }


    checkOrder(){
        let securesTokens = []
        this.everyTokens.map((token) => {

            //Se verfica que fichas estan en la misma posicion y en posicion segura
            this.everyTokens.map((token2) => {

                if (token.pos == token2.pos && token.name != token2.name && this.isSecure(token) && this.isSecure(token2)) {

                    if (!securesTokens.includes(token)) {
                        securesTokens.push(token)
                    }
                    if (!securesTokens.includes(token2)) {
                        securesTokens.push(token2)
                    }
                }
            })

            if (!this.isSecure(token)) {
                this.orderTokens(null)
            }

        })

        if (securesTokens.length > 1) {
            this.orderTokens(securesTokens)
        }else{
            this.orderTokens(null)
        }
    }

    // Ordenar fichas si estan en una misma casilla reduciendo el tamaño (tokens != null)
    //  o las vuelve al la normalidad si no lo estan (tokens == null)
    orderTokens(tokens){

        if (tokens == null) {
            this.everyTokens.map((token) => {

                if (token.live) {
                    token.setScale(0.4)
                    token.x = token.road['s'+token.steps].x
                    token.y = token.road['s'+token.steps].y
                }

            })
            return
        }

        let loop1 = true
        let loop2 = true
        let loop3 = true
        let loop4 = true

        for (let i in tokens){

            tokens[i].setScale(0.2)

            if (loop1) {
                tokens[i].x = tokens[i].road['s'+tokens[i].steps].x - 10
                tokens[i].y = tokens[i].road['s'+tokens[i].steps].y - 10
                loop1 = false
                continue
            }
            if (loop2) {
                tokens[i].x = tokens[i].road['s'+tokens[i].steps].x + 10
                tokens[i].y = tokens[i].road['s'+tokens[i].steps].y + 10
                loop2 = false
                continue
            }
            if (loop3) {
                tokens[i].x = tokens[i].road['s'+tokens[i].steps].x + 10
                tokens[i].y = tokens[i].road['s'+tokens[i].steps].y - 10
                loop3 = false
                continue
            }
            if (loop4) {
                tokens[i].x = tokens[i].road['s'+tokens[i].steps].x - 10
                tokens[i].y = tokens[i].road['s'+tokens[i].steps].y + 10
                loop4 = false
                continue
            }


        }
    } 
    gameOver(winner) {
        this.winner = winner
        this.scene.start('GameOver')
    }  
}

export default Game;
