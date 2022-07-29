const socketio = require("socket.io")

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

var io = undefined
var sessionMiddleware = undefined

module.exports = {
    use: function(pack){
        if(!io && pack.server){
            io = socketio(pack.server)
        } else {
            io? console.error('package.server must be a server instance') : console.warn('Didn\'t linked io to server because io is already linked')
        }
        if(!sessionMiddleware && pack.session) {
            sessionMiddleware = pack.session
        } else {
            io? console.error('package.session must be a session instance') : console.warn('Didn\'t keep session beceause there is already one')
        }
    },
    Namespace: class {
        constructor(namespace = "/"){
        if(!io){console.error('link io to server before creating namespace.')}
            io.of(namespace).use(wrap(sessionMiddleware));
        return io.of(namespace)
    }}
}