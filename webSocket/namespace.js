const { Session } = require("express-session");

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

module.exports = class{
    constructor(io=Object, namespace = "/", sessionMiddleware=Session){
        io.of(namespace).use(wrap(sessionMiddleware));
        return io.of(namespace)
    }
}