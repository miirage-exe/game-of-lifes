const { simulation_duration } = require("./game.data")
const { runBoardCycle } = require("./game.engine")
const { Player } = require("./game.module")

/**
 * Returns an EventEmitter wich can be linked with the master
 */



/*
 module.exports._run_operator_process=(Game)=>{

    function thereIsWinner(){
        return false
    }

    function _run_PlayState(){
        console.log('ON PLAY:')

        setTimeout(()=>{
            Game.event.emit('progress:SIMULATION')
        }, simulation_duration)
    }

    function _run_SimulationState(){

        Game.board = runBoardCycle(Game.board)

        setTimeout(()=>{
            Game.io.emit('progress:cycle:stop', Game.board)

            if (thereIsWinner()){
                _switch_Context('victory')
            }else{
                _switch_Context('play')
            }
        }, simulation_duration)
    }

    function _switch_Context(context=String){

        //Set the game.context.current to the context called
        Game.context.current = Game.context[context]

        switch (context) {
            case 'play':
                _run_PlayState()
                break;
            case 'simulation':
                _run_SimulationState()
                break;
            case 'victory':
                console.log('koool, winner')
                break;
        
            default:
                console.error(new ErrorEvent('wrong switch statement'))
                break;
        }
    }

    _switch_Context('play')
 }*/
