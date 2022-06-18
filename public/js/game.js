var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');


const cote = 64
const cellSize = 2

function showdict(){
    console.clear()
    for (let i = 0; i <= cote+1; i++) {
        console.log(dict[i])
    }
}

// Genère le dict
var dict = {}
for (let i = 0; i < cote+2; i++) {
    dict[i] = []
        for (let j = 0; j < cote+2; j++) {
            if(j%2){
                dict[i].push(false)
            } else {
                dict[i].push(true)
            }
        }
}

showdict()

function runStep(){
    var nxtDict = {}
    var p =0

    //first colonne 
    // i = 0
    nxtDict[0] = []
        for (let j = 0; j <= cote+1; j++) {
            nxtDict[0].push(false)
        }


    for (let i = 1; i <= cote; i++) {

        nxtDict[i] = []
        nxtDict[i].push(false)

            for (let j = 1; j <= cote; j++) {
                //calcul population
                p = 0
                for (let ik = i-1; ik <= i+1; ik++) {
                    for (let jk = j-1; jk <= j+1; jk++) {                        
                        if(dict[ik][jk]){
                            p++
                        }
                    }
                }
                if(dict[i][j]){
                    if(p==3 || p==4){
                        nxtDict[i].push(true)
                    } else {
                        nxtDict[i].push(false)
                    }
                } else if(p==3){
                    nxtDict[i].push(true)
                } else {
                    nxtDict[i].push(false)
                }
            }

        nxtDict[i].push(false)
    }

    //last colonne
    // i = cote+1
    nxtDict[cote+1] = []
        for (let j = 0; j <= cote+1; j++) {
            nxtDict[cote+1].push(false)
        }
    
    dict = nxtDict
    return dict
}


var frame = 0
function runGame(){
    if(frame<100){
        frame++
        setTimeout(()=>{runGame()}, 10)
        console.log('salut mon pote')
    }
    runStep()
    drawGrid()
}

function drawGrid(){
    for (let i = 1; i <= cote; i++) {
        for (let j = 1; j <= cote; j++) {
            if(dict[i][j]){
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect((i-1)*cellSize, (j-1)*cellSize, cellSize, cellSize);
        }
    }
}


ctx.width = 800
ctx.height = 800