const GameBuilder = require('../game/game.builder').GameBuilder;

const {Player} = require('../game/game.module.js')
const GameInstance = require('../game/game.module.js').Game

const webSocket =require('../../middlewares/webSocket.js')
const ioRooms = new webSocket.Namespace("/rooms")

// Degeulasse revoir architecture
module.exports = (function(){

    console.log('launched room')

    function firstConnect(roomToken=String, socketId=String){
        if(ioRooms.adapter.rooms.get(roomToken)){
            for (const clientId of ioRooms.adapter.rooms.get(roomToken)) {
                //this is the socket of each client in the room.
                if(ioRooms.sockets.get(clientId)._user._id == socketId){
                    return false
                }
            }
            return true
        }
        return true
    }

    ioRooms.on('connection', (socket) => {

        const roomToken = socket.handshake.headers.referer.split('/')[socket.handshake.headers.referer.split('/').length - 1]
        const toRoom = ioRooms.to(roomToken)

        if(!socket.request.session._user || !socket.request.session._user._id){
            socket.emit('init-res:user-connection', "not connected")
            socket.disconnect()
            return false
        }

        if(!firstConnect(roomToken, socket.request.session._user._id)){
            socket.emit('init-res:user-connection',"already connected in another tab")
            socket.disconnect()
            return false
        }

        socket._user = socket.request.session._user
        socket.team = Math.round(Math.random())==1
        socket.join(roomToken)
        socket.emit('init-res:user-connection', false, socket.team)

        socket.on('usr-req:switch-team', (next)=>{
            socket.team = !socket.team
            next(socket.team);
        })

        socket.on('usr-req:launch-game', ()=>{
            const Game = buildGameInstanceFromRoom(ioRooms.adapter.rooms.get(roomToken))
            GameBuilder.emit('build-game', Game)
            toRoom.emit('evnt-res:launch-game', Game.token);
        })
    })
})()

function buildGameInstanceFromRoom(room){
    var Game = new GameInstance({
        play:{
            duration: 10000,
        },
        simulaion:{
            duration: 10000,
        }
    })
            //setup users data
            for (const clientId of room) {
                const socket = ioRooms.sockets.get(clientId)
                const thisPlayer = new Player( socket._user._id, socket._user._username, socket.team )
                Game = includePlayerInstanceInGame(thisPlayer, Game)
            }
    return Game
}

function includePlayerInstanceInGame(Player=Object, Game=Object){
    Game.teams[Player.team].push(Player.id)
    Game.players[Player.id] = Player
    return Game
}