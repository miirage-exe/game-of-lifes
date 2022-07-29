// global imports
const { randomUUID } = require('crypto');
const EventEmitter = require('events');
const { _run_operator_process } = require('./game.operator');
const Namespace = require('../../middlewares/webSocket').Namespace;
const buildBoard = require('./game.engine').buildBoard;

module.exports.Game = class{

    constructor(pack){
        this.context={}
        this.context.simulation=pack.simulation
        this.context.play=pack.play
    }

    token = randomUUID()

    io = new Namespace('/game/' + this.token)

    teams = {
        false:[],// contient les id des joueurs
        true:[]// contient les id des joueurs
    }

    players = {};

    board = buildBoard();

    event = new EventEmitter

    run = ()=>{_run_operator_process(this)}
}

module.exports.Player = class{
    constructor(id=String, username=String, team=Boolean){
        this.id=id
        this.username=username
        this.team=team
    }
}



