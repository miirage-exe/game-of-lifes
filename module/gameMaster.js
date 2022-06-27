const webSocket = require('../middlewares/webSocket.js')
const EventEmitter = require('events');

const gameEvent = new EventEmitter()

gameEvent.on("build-game", (gameToken = String , players=Object)=>{
               
        const ioGame = new webSocket.Namespace('/game/'+gameToken)

        ioGame.on('connection', (socket) => {
            if (!players[socket.request.session._user._id]){
                socket.disconnect()
                return false
            }
            socket.join('players')

            socket.on('user:set-tile', (x,y,v=null)=>{
                console.log(x,y,v)

                if (v) v=players[socket.request.session._user._id].team;
                ioGame.to('players').emit('canvas:set-tile', x, y, v)
            })
        })

        function loop(){
            ioGame.emit('launch-sim', 24*10, 24)
            console.log('slt')
            setTimeout(()=>{
                loop()
            }, 20*1000)
        }

        setTimeout(()=>{
            loop()
        }, 10*1000)
    }
)

module.exports = gameEvent 