const Namespace = require('./namespace.js')
const socketio = require("socket.io")
const EventEmitter = require('events');
const { stringify } = require('querystring');
const Error = require('./error.js')

const serverSockets = new EventEmitter();



module.exports = (server, session) => {

    const io = socketio(server)
    const ioRooms = new Namespace(io, "/rooms", session)

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
        console.log('socketId : '+ socket.id)
        console.log('userId : '+ socket.request.session._user._id)

        var cll = ioRooms.adapter.rooms.get(roomToken)

        if(!firstConnect(roomToken, socket.request.session._user._id)){
            socket.emit('init-res:user-connection', new Error("already connected in another tab"))
            socket.disconnect()
            return false
        }

        socket._user = socket.request.session._user
        socket.join(roomToken)
        socket.emit('init-res:user-connection', false)
    })
}