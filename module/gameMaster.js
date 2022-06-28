const webSocket = require('../middlewares/webSocket.js')
const EventEmitter = require('events');
const { copyFileSync } = require('fs');

const gameEvent = new EventEmitter()
const durationPrepa = 10*1000
const durationChaos = 10*1000
const framerate = 24
const cote = 64



function generateEmpty(){
    var FuncBoard = {}
    for (let i = 0; i <= cote+1; i++) {
        FuncBoard[i]=[]
        for (let j = 0; j <= cote+1; j++) {
            FuncBoard[i].push(null)
        }
    }
    return FuncBoard
}



function calculateGenerationStep(Board){
    var nxtBoard = {};
    var p =0;
    var pi = 0

    //first colonne ;
    // i = 0;
    nxtBoard[0] = [];
    for (let j = 0; j <= cote+1; j++) {
        nxtBoard[0].push(null)
    }

    for (let i = 1; i <= cote; i++) {
        nxtBoard[i] = []
        nxtBoard[i].push(null)
            for (let j = 1; j <= cote; j++) {
                //calcul population
                p = []
                pi=0
                for (let ik = i-1; ik <= i+1; ik++) {
                    for (let jk = j-1; jk <= j+1; jk++) {                        
                        if(Board[ik][jk] !== null){
                            p++
                            Board[ik][jk]? pi++ : null
                        }
                    }
                }
                if(Board[i][j] === null && p === 3){//cas naissance de la cellule
                    pi>1? nxtBoard[i].push(true) : nxtBoard[i].push(false)
                } else if (p === 4 || p === 3){// cas survie de la cellule
                    nxtBoard[i].push(Board[i][j])
                } else {//cas mort de la cellule
                    nxtBoard[i].push(null)
                }
            }
        nxtBoard[i].push(null)
    }

    //last colonne
    // i = cote+1
    nxtBoard[cote+1] = []
    for (let j = 0; j <= cote+1; j++) {
        nxtBoard[cote+1].push(null)
    }
    
    return nxtBoard
}




gameEvent.on("build-game", (gameToken = String , players=Object)=>{
    
        
        const localGameEvent = new EventEmitter()
        var Board = generateEmpty()
        var progress = 'preparation'

        const ioGame = new webSocket.Namespace('/game/'+gameToken)

        ioGame.on('connection', (socket) => {
            if (!players[socket.request.session._user._id]){
                socket.disconnect()
                return false
            }
            socket.join('players')

            socket.on('usr-ask:can-edit', (cb)=>{
                cb(progress =='preparation')
            })
            
            if(progress == 'preparation'){
                socket.on('user:set-tile', (x,y,state=null)=>{
                    if (state) {
                        state=players[socket.request.session._user._id].team;
                    }
                    Board[x][y] = state;
                    ioGame.to('players').emit('canvas:set-tile', x, y, state)
                })
            }

            localGameEvent.on('server:enable-edit', ()=>{
                socket.on('user:set-tile', (x,y,state=null)=>{
                    if (state) {
                        state=players[socket.request.session._user._id].team;
                        Board[x][y] = state;
                    }
                    ioGame.to('players').emit('canvas:set-tile', x, y, state)
                })
            })

            localGameEvent.on('server:disable-edit', ()=>{
                socket.removeAllListeners('user:set-tile')
            })
        })

        function run(i, max){
            Board = calculateGenerationStep(Board)
            console.log("Calculated frame n°"+i)
            ioGame.emit('render:board', Board)
            if(i<max){
                i++
                setTimeout(()=>{run(i, max)}, 20)
            } else{
                return false
            }
        }

        function checkWinner(){
            setTimeout(setupPrepa, 10)
        }

        function setupPrepa(){
            progress = 'preparation'
            localGameEvent.emit('server:enable-edit')

            ioGame.emit('progress:preparation-phase', Board)
            
            setTimeout(setupChaos, durationPrepa)
        }

        function setupChaos(){
            progress = 'chaos'
            localGameEvent.emit('server:disable-edit')

            ioGame.emit('progress:chaos-phase')

            const numberOfFrames = Math.round((durationChaos/1000)*framerate);
            const endSimulationAt = Date.now()+ durationChaos

            ioGame.emit('chaos-phase:launch-simulation', numberOfFrames, endSimulationAt, Board)
 

            for(i=0; i<numberOfFrames; i++){
                Board = calculateGenerationStep(Board)
                console.log('frame n°' + i)
            }

            setTimeout(checkWinner, endSimulationAt+1000 - Date.now())
        } 

        setupPrepa()        
    }
)

module.exports = gameEvent 