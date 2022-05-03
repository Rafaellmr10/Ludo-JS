import Tokens from '../GameObjects/tokens.js'
import Dice from '../GameObjects/dice.js'
import Board from '../GameObjects/board.js'
import Button from '../GameObjects/button.js'

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

        this.backBtn = new Button(this, 90, this.game.config.height - 100)
        this.backBtn.setText('BACK')
        this.backBtn.setSceneObj('Menu')
        this.backBtn.tween.pause()

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

        })

        if (securesTokens.length > 1) {
            this.orderTokens(securesTokens)
        }

        this.teams.map((team) => { 

            let winers = 0
            team.children.iterate((token) => {

                //Se verifica cuantas fichas de x color han llegado a la meta, si son mas de 4 GANA!
                if (token.finalSteps == 6) {

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

        let idx = this.teams.indexOf(current)
        idx = (idx == this.teams.length - 1)? 0 : idx + 1

        return (next)? this.teams[idx] : current

    }

    checkTurn(token) {

        if(this[token.name].turn && this.dice.getData('rolled')) {
            

            // Determina si el dado arrojo 1 o 6
            let comodin = (this.dice.getData('value') == 6 || this.dice.getData('value') == 1)? true: false;

            if(token.live){

                /*
                    Si la posicion de la ficha es menor a 51 se establece la nueva posicion (posicion actual + valor del dado),
                    Si no, sigue siendo null
                 */
                let newPos = token.pos? token.pos + this.dice.getData('value') : null
                newPos =  (newPos > 52)? newPos - 52: newPos

                if (token.steps != null && token.steps + this.dice.getData('value') < 51) {

                    this.move(token, this.board.squares['s' + newPos], newPos)
                    token.steps += this.dice.getData('value')

                }else {

                    let finalSquares = this.board.squares[token.name]
                    
                    /*
                        Si aun la ficha no entrado a la zona segura para ganar pero si
                        el valor del dado posicionea la ficha en dicha zona entonces...
                     */
                    if(token.steps) {

                        // Se mueve al casilla previa
                        this.move(token, finalSquares.s0, null)
                        token.finalSteps = (this.dice.getData('value')) - (50 - token.steps)

                        // Se mueve a la casilla correspondiente a la posición final
                        token.finalSteps = Math.abs(token.finalSteps)
                        this.move(token, finalSquares['s' + token.finalSteps], null)
                        token.steps = null

                    }else if (token.finalSteps != 6) {


                        /* Si la ficha va subiendo (token.up == true), entonces... */

                        if(token.up) {

                            let newFinalSteps = token.finalSteps + this.dice.getData('value')
                            
                            /* 
                                Si la posicion final mayor a 6 entonces los pasos restantes
                                se aplican a una nueva posición inicial y cambia el valor de token.up
                            */
                            if (newFinalSteps > 6) {

                                // Se mueve a la casilla de ganar
                                this.move(token, finalSquares.s6, null)
                                token.up = false
                                token.finalSteps = (this.dice.getData('value')) - (6 - token.finalSteps)

                                // Se regresa a la posición correspondiente
                                token.finalSteps = 6 - token.finalSteps
                                this.move(token, finalSquares['s' + token.finalSteps], null)
                            
                            /* De lo contriario solo se mueve la ficha a dicha posisción final */
                            }else {
                                token.finalSteps = newFinalSteps
                                this.move(token, finalSquares['s' + token.finalSteps], null)
                            }

                        }else {

                        /* Si la ficha no va subiendo (token.up == false) entonces... */
                            
                            let newFinalSteps = token.finalSteps - this.dice.getData('value')

                            /* 
                                Si la posicion final menor a 1 entonces los pasos restantes
                                se aplican a una nueva posicion inicial y cambia el valor de token.up
                            */
                            if (newFinalSteps < 1) {

                                // Se mueve a la casilla 1 de la zona segura
                                this.move(token, finalSquares['s' + 1], null)
                                token.up = true
                                token.finalSteps = (this.dice.getData('value')) - (token.finalSteps - 1)

                                //Se mueve a la cassilla correspondiente
                                token.finalSteps = (1 + token.finalSteps)
                                this.move(token, finalSquares['s' + token.finalSteps], null)
                                
                            }

                            /* De lo contriario solo se mueve la ficha a dicha posiscion final */
                            else {
                                token.finalSteps = newFinalSteps
                                this.move(token, finalSquares['s' + token.finalSteps], null)
                            }


                            // Si la ficha esta en la meta pierde su interactividad ya que debe quedarse ahi
                            if (token.finalSteps == 6) {
                                token.setInteractive(false)
                                this.setTurn(this[token.name])
                            }

                        }

                        

                    }
                }

                if (!comodin) {

                    let next = this.getTurn(true)
                    this.setTurn(next)//Cambio de turno al siguiente

                }

            }else if(comodin) {
                token.live = true
                this.move(token, this.board.squares['s' + token.pos], token.pos)
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
            if (token.live && target.live && (this[token.name].clicked || this[target.name].clicked)) {
                token.childs.push(target)
                if (target.childs.length >= 1) {
                    for (let i in target.childs) {
                        token.childs.push(target.childs[i])
                    }
                }
                target.live = false
                target.destroy(true) 

                this.setTurn(this[token.name])

            }

            
        }else if (token.pos == target.pos){

            //Matar a otra(s) ficha(s)

            if ((this[token.name].clicked) && (!this.isSecure(target) || token.steps == 0)) {
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
        if (token.childs.length >= 1) {
            for (let i in token.childs){
            this[token.name].newToken(token.childs[i].house.x, token.childs[i].house.y)
            }
        }
        this[token.name].newToken(token.house.x, token.house.y)
            
        token.live = false 
        Phaser.Utils.Array.Remove(this.everyTokens, token)
        token.destroy(true)
    }

    move(token, square, newPos) {

        token.x = square.x
        token.y = square.y
        token.pos = newPos
        this.dice.setData('rolled', false)

        this[token.name].canMove(true)
    }

    orderTokens(tokens){
        let loop1 = true
        let loop2 = true
        let loop3 = true
        let loop4 = true
        
        this.everyTokens.map((token) => {

            if (token.live) {
                token.setScale(0.4)
                token.x = this.board.squares['s'+token.pos].x
                token.y = this.board.squares['s'+token.pos].y
            }

        })

        for (let i in tokens){

            tokens[i].setScale(0.2)

            if (loop1) {
                tokens[i].x = this.board.squares['s'+tokens[i].pos].x - 10
                tokens[i].y = this.board.squares['s'+tokens[i].pos].y - 10
                loop1 = false
                continue
            }
            if (loop2) {
                tokens[i].x = this.board.squares['s'+tokens[i].pos].x + 10
                tokens[i].y = this.board.squares['s'+tokens[i].pos].y + 10
                loop2 = false
                continue
            }
            if (loop3) {
                tokens[i].x = this.board.squares['s'+tokens[i].pos].x + 10
                tokens[i].y = this.board.squares['s'+tokens[i].pos].y - 10
                loop3 = false
                continue
            }
            if (loop4) {
                tokens[i].x = this.board.squares['s'+tokens[i].pos].x - 10
                tokens[i].y = this.board.squares['s'+tokens[i].pos].y + 10
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
