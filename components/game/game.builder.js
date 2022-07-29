// global imports
const EventEmitter = require('events')
module.exports.GameBuilder = new EventEmitter()

module.exports.GameBuilder.on("build-game", (Game)=>{
    console.log('GAME: Handling sockets...')
    handleSocketsConnectionsOf(Game)
    Game.run()
    }
)

function handleSocketsConnectionsOf(Game){
    Game.io.on('connection', (socket) => {
        console.log('user connected')
        Game.players[socket.request.session._user._id]===undefined? ()=>{console.warn('kicked player'); socket.disconnect(); return false} : null ;
        socket.join('players')

        socket.on('add-tile', (x, y, s=null)=>{
            console.log('adding-tile')
            s? s = Game.players[socket.request.session._user._id].team : null ;
            Game.board[x][y] = s
            Game.io.to('players').emit('set-tile', (x,y,s))
        })
    })
}