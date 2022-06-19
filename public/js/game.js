var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');

var cote = 64;
var ANTI_ALIASING = 1
var padding = 0;

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
ctx.width = canvas.clientWidth 
ctx.height = canvas.clientHeight

var cellSize = Math.floor(canvas.clientWidth/cote);

var flag = false;
var dict = {};

var recursive = 0

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

                    switch(Math.floor(Math.random()*5)){
                        case 2:
                            i>cote/2? dict[i].push(true):dict[i].push(false)
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
    var pi = 0

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
                p = []
                pi=0
                for (let ik = i-1; ik <= i+1; ik++) {
                    for (let jk = j-1; jk <= j+1; jk++) {                        
                        if(dict[ik][jk] !== undefined){
                            p++
                            dict[ik][jk]? pi++ : undefined
                        }
                    }
                }
                if(dict[i][j] === undefined && p === 3){//cas naissance de la cellule
                    pi>1? nxtDict[i].push(true) : nxtDict[i].push(false)
                } else if (p === 4 || p === 3){// cas survie de la cellule
                    nxtDict[i].push(dict[i][j])
                } else {//cas mort de la cellule
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



    var diff = false;
    recursive++
    for(let i = 1; i <=cote; i++){
        for(let j = 1; j <=cote; j++){
            if(dict[i][j]!==nxtDict[i][j]){
                recursive = 0
                diff = true
                break
            }
        }
    }


    var audio;
    diff? audio = new Audio('/audio/remove.mp3') : audio = new Audio('/audio/norun.mp3')  
    audio.volume = 0.2
    audio.play();
    
    dict = nxtDict
    return dict
}


function runGame(){

    if(recursive>20){
        flag=false
        recursive = 0
        var audio = new Audio('/audio/start.mp3');
        audio.play();
    }

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
                ctx.fillStyle = '#a97efa';
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
    mouseX = Math.ceil((event.clientX - rect.left)*ANTI_ALIASING/cellSize);
    mouseY = Math.ceil((event.clientY - rect.top)*ANTI_ALIASING/cellSize);
}



window.addEventListener('keydown', function(e) {
    if(e.key == ' ' && e.target == document.body) {
      e.preventDefault();
    }
});

document.addEventListener('keydown', function(event) {
    console.log(event.key)
    if(event.key == ' ') {
        flag = !flag
        flag? runGame() : undefined
        var audio = new Audio('/audio/start.mp3');
        audio.play();
    }
    if(event.key == 'r') {
        randomize()
        renderFrame()

        for (let s = 0; s < 4; s++) {
            setTimeout(()=>{
                var audio = new Audio('/audio/add.mp3');
                audio.volume = 0.4
                audio.play()}, s*33)
        }
    }
    if(event.key == 'Delete' || event.key == 'c') {
        generate()
        renderFrame()
        flag = false

        var audio = new Audio('/audio/erase.mp3');
        audio.volume = 0.4
        audio.play();
    }
    if(event.key == '+') {
        padding = Math.min(0.24, padding+0.02)
        renderFrame()
    } if(event.key == '-') {
        padding = Math.max(0, padding-0.02)
        renderFrame()
    }
    if(event.key == 'ArrowRight'){
        calculateGenerationStep()
        renderFrame()
    }

});

window.oncontextmenu = function ()
{
    return false;     // cancel default menu
}

canvas.addEventListener('mousedown', function (e) {
    console.log('cc')
    var isRightMB;
    e = e || window.event;

    if ("which" in e){  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    } else if ("button" in e){  // IE, Opera 
        isRightMB = e.button == 2; 
    }

    getMousePosition(canvas, e)

    if(dict[mouseX][mouseY]!==undefined){
        dict[mouseX][mouseY] = undefined;
        var audio = new Audio('/audio/add.mp3');
        audio.volume = 0.2
    } else {
        isRightMB? dict[mouseX][mouseY] = false : dict[mouseX][mouseY] = true
        var audio = new Audio('/audio/remove.mp3');
    } 
    audio.play(); 
    renderFrame()    
})

window.addEventListener('resize', async function(e) {

    canvas.width = canvas.clientWidth * ANTI_ALIASING
    canvas.height = canvas.clientHeight * ANTI_ALIASING

    ctx.width = canvas.clientWidth * ANTI_ALIASING
    ctx.height = canvas.clientHeight * ANTI_ALIASING

    cellSize = canvas.clientWidth/cote * ANTI_ALIASING
    renderFrame()
});

canvas.width = canvas.clientWidth * ANTI_ALIASING
canvas.height = canvas.clientHeight * ANTI_ALIASING

ctx.width = canvas.width
ctx.height = canvas.height

cellSize = canvas.width/cote
renderFrame()