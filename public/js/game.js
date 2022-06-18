var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');

const cote = 64
const cellSize = 8

ctx.width = cote*cellSize
ctx.height = cote*cellSize

var flag = false
var dict = {};





function randomize(){

    //first colonne 
        // i = 0
        dict[0] = []
        for (let j = 0; j <= cote+1; j++) {
            dict[0].push(undefined)
        }


        for (let i = 1; i <= cote; i++) {

            dict[i] = []
            dict[i].push(undefined)

                for (let j = 1; j <= cote; j++) {

                    switch(Math.floor(Math.random()*5)){
                        case 2:
                            dict[i].push(true)
                        // case 4:
                        //     dict[i].push(false)
                        default:
                            dict[i].push(undefined)
                    }
                }

            dict[i].push(undefined)
        }

        //last colonne
        // i = cote+1
        dict[cote+1] = []
        for (let j = 0; j <= cote+1; j++) {
            dict[cote+1].push(undefined)
        }
}




function calculateGenerationStep(){
    var nxtDict = {}
    var p =0

    //first colonne 
    // i = 0
    nxtDict[0] = []
        for (let j = 0; j <= cote+1; j++) {
            nxtDict[0].push(undefined)
        }


    for (let i = 1; i <= cote; i++) {

        nxtDict[i] = []
        nxtDict[i].push(undefined)

            for (let j = 1; j <= cote; j++) {
                //calcul population
                p = 0
                for (let ik = i-1; ik <= i+1; ik++) {
                    for (let jk = j-1; jk <= j+1; jk++) {                        
                        if(dict[ik][jk] !== undefined){
                            p++
                        }
                    }
                }
                if(p===3){
                    nxtDict[i].push(true)
                } else if (dict[i][j] !== undefined && p === 4){
                    nxtDict[i].push(true)
                } else {
                    nxtDict[i].push(undefined)
                }
            }

        nxtDict[i].push(undefined)
    }

    //last colonne
    // i = cote+1
    nxtDict[cote+1] = []
        for (let j = 0; j <= cote+1; j++) {
            nxtDict[cote+1].push(undefined)
        }
    
    dict = nxtDict
    return dict
}


function runGame(){

    if(flag){setTimeout(()=>{runGame();}, 20)}
    
    calculateGenerationStep()
    renderFrame()
}

function renderFrame(){
    for (let i = 1; i <= cote; i++) {
        for (let j = 1; j <= cote; j++) {
            if(dict[i][j] === undefined){
                if((i+j)%2){
                    ctx.fillStyle = '#EDEDED';
                } else {
                    ctx.fillStyle = 'white';
                }
            } else if(dict[i][j] === false){
                ctx.fillStyle = 'red';
            }else {
                ctx.fillStyle = 'black';
            }
            ctx.fillRect((i-1)*cellSize, (j-1)*cellSize, cellSize, cellSize);
        }
    }
}

clear()
renderFrame()