var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');

const cote = 64;
var padding = .12;

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
ctx.width = canvas.clientWidth
ctx.height = canvas.clientHeight

var cellSize = Math.floor(canvas.clientWidth/cote);

var flag = false;
var dict = {};

function generate(){
    for (let i = 0; i <= cote+1; i++) {
        dict[i]=[]
        for (let j = 1; j <= cote; j++) {
            dict[i].push(undefined)
        }
    }
}

function randomize(){

    //first colonne ;
        // i = 0
        dict[0] = [];
        for (let j = 0; j <= cote+1; j++) {
            dict[0].push(undefined);
        }


        for (let i = 1; i <= cote; i++) {

            dict[i] = [];
            dict[i].push(undefined);

                for (let j = 1; j <= cote; j++) {

                    switch(Math.floor(Math.random()*3)){
                        case 2:
                            dict[i].push(true);
                        // case 4:;
                        //     dict[i].push(false);
                        default:
                            dict[i].push(undefined);
                    }
                }

            dict[i].push(undefined);
        }

        //last colonne;
        // i = cote+1;
        dict[cote+1] = [];
        for (let j = 0; j <= cote+1; j++) {
            dict[cote+1].push(undefined);
        }
}




function calculateGenerationStep(){
    var nxtDict = {};
    var p =0;

    //first colonne ;
    // i = 0;
    nxtDict[0] = [];
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

    if(flag){setTimeout(()=>{runGame();}, 50)}
    
    calculateGenerationStep()
    renderFrame()
}

function renderFrame(){
    for (let i = 1; i <= cote; i++) {
        for (let j = 1; j <= cote; j++) {
            if(!dict[i] || dict[i][j] === undefined){
                if((i+j)%2){
                    ctx.fillStyle = '#242424';//EDEDED
                } else {
                    ctx.fillStyle = '#181818';//white
                }
            } else if(dict[i][j] === false){
                ctx.fillStyle = 'red';
            }else {
                ctx.fillStyle = '#DF5050';
            }
            ctx.clearRect((i-1)*cellSize, (j-1)*cellSize,cellSize, cellSize)
            for (let f = 0; f < 5; f++) {
                ctx.fillRect(((i-1)*cellSize) + cellSize*padding, ((j-1)*cellSize) + cellSize*padding, cellSize - (cellSize*padding*2), cellSize - (cellSize*padding*2));
            }
        }
    }
}

generate()
renderFrame()
console.log(dict)

let mouseX, mouseY

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = Math.ceil((event.clientX - rect.left)/cellSize);
    mouseY = Math.ceil((event.clientY - rect.top)/cellSize);
}

  
canvas.addEventListener("mousedown", function(e)
{
    getMousePosition(canvas, e)

    dict[mouseX][mouseY]==undefined? dict[mouseX][mouseY] = true : dict[mouseX][mouseY] = undefined
    renderFrame()
});

window.addEventListener('keydown', function(e) {
    if(e.key == ' ' && e.target == document.body) {
      e.preventDefault();
    }
});

document.addEventListener('keydown', function(event) {
    if(event.key == ' ') {
        flag = !flag
        flag? runGame() : undefined
    }
    if(event.key == 'r') {
        randomize()
        renderFrame()
    }
    if(event.key == 'Delete' || event.key == 'c') {
        generate()
        renderFrame()
        flag = false
    }
    if(event.key == '+') {
        padding = Math.min(0.24, padding+0.02)
        renderFrame()
    } if(event.key == '-') {
        padding = Math.max(0, padding-0.02)
        renderFrame()
    }
});

window.addEventListener('resize', async function(e) {

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    ctx.width = canvas.clientWidth
    ctx.height = canvas.clientHeight

    cellSize = canvas.clientWidth/cote
    renderFrame()
});

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

ctx.width = canvas.clientWidth
ctx.height = canvas.clientHeight

cellSize = canvas.clientWidth/cote
renderFrame()