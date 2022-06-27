const webSocket = require('../middlewares/webSocket.js')
const EventEmitter = require('events');
const Error = require('../presets/WSerror.js')
const GameMaster =require('./gameMaster.js');
const { randomUUID } = require('crypto');

module.exports = (server, session) => {

    const ioRooms = new webSocket.Namespace("/rooms")

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

        if(!socket.request.session._user || !socket.request.session._user._id){
            socket.emit('init-res:user-connection', new Error( "not connected"))
            socket.disconnect()
            return false
        }

        if(!firstConnect(roomToken, socket.request.session._user._id)){
            socket.emit('init-res:user-connection', new Error("already connected in another tab"))
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
            const gameToken = randomUUID()

            let userTable = {}
            //setup users data
            for (const clientId of ioRooms.adapter.rooms.get(roomToken)) {
                userTable[ioRooms.sockets.get(clientId)._user._id] = {
                    username: ioRooms.sockets.get(clientId)._user._id,
                    team: ioRooms.sockets.get(clientId).team
                }
            }

            ioRooms.to(roomToken).emit('evnt-res:launch-game', false, gameToken);
            GameMaster.emit('build-game', gameToken, userTable)

            console.log('salutmonpote')
        })
    })
}