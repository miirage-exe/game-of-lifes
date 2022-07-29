const totalFrames = require('./game.data').simulation_framesPerCycle
const cote = require('./game.data').board_sideLength

module.exports.buildBoard = function(){
    let board = {}
    for (let i = 0; i <= cote+1; i++) {
        board[i]=[]
        for (let j = 0; j <= cote+1; j++) {
            board[i].push(null)
        }
    }
    return board
}

module.exports.runBoardCycle = function(board){
    console.log(`---> ENGINE: Started Cycle calculation (${totalFrames} frames to render)`)
    for(i=0; i < totalFrames; i++){
        board = __local_calculateGenerationStep(board)
    }
    console.log(`---> ENGINE: Finished Cycle calculation (${totalFrames} frames rendered)`)
    return board
}

function __local_generateEmptyColumn(){
    let column = []
    for (let j = 0; j <= cote+1; j++) {
        column.push(null)
    }
    return column
}

function __local_calculateGenerationStep(Board=Object){

    let nxtBoard = [];

    //first colonne ;
    // i = 0;
    nxtBoard[0] = __local_generateEmptyColumn()

    for (let i = 1; i <= cote; i++) {
        nxtBoard[i] = [null]
        
        //calcul population
        for (let j = 1; j <= cote; j++) {
            
            let p = []
            let pi=0

            //prise d'information de l'environnement
            for (let ik = i-1; ik <= i+1; ik++) {
                for (let jk = j-1; jk <= j+1; jk++) {                        
                    if(Board[ik][jk] !== null){
                        p++
                        Board[ik][jk]? pi++ : null
                    }
                }
            }

            //generation de la cellule
            if(Board[i][j] === null && p === 3){// cas naissance de la cellule
                pi>1? nxtBoard[i].push(true) : nxtBoard[i].push(false)
            } else if (p === 4 || p === 3){// cas survie de la cellule
                nxtBoard[i].push(Board[i][j])
            } else {// cas mort de la cellule
                nxtBoard[i].push(null)
            }
        }

        nxtBoard[i].push(null)
    }

    //last colonne
    // i = cote+1
    nxtBoard[cote+1] = __local_generateEmptyColumn()
    
    return nxtBoard
}

