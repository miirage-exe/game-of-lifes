

var cote = 64;
var ANTI_ALIASING = 3
var padding = 0;

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
ctx.width = canvas.clientWidth 
ctx.height = canvas.clientHeight

var cellSize = Math.floor(canvas.clientWidth/cote);

function renderFrame(Fdict = dict){
    
    cellSize = canvas.clientWidth/cote * ANTI_ALIASING
    for (let i = 1; i <= cote; i++) {
        for (let j = 1; j <= cote; j++) {
            if(!Fdict[i] || Fdict[i][j] === null){
                if((i+j)%2){
                    ctx.fillStyle = '#242424';//EDEDED
                } else {
                    ctx.fillStyle = '#181818';//white
                }
            } else if(Fdict[i][j] === false){
                ctx.fillStyle = 'white';//#a97efa
            }else {
                ctx.fillStyle = '#DF5050';//#DF5050
            }
            ctx.clearRect((i-1)*cellSize, (j-1)*cellSize,cellSize, cellSize)
            for (let f = 0; f < 5; f++) {
                ctx.fillRect(((i-1)*cellSize) + cellSize*padding, ((j-1)*cellSize) + cellSize*padding, cellSize - (cellSize*padding*2), cellSize - (cellSize*padding*2));
            }
        }
    }
}

function calculateResize(){
    canvas.width = canvas.clientWidth * ANTI_ALIASING
    canvas.height = canvas.clientHeight * ANTI_ALIASING

    ctx.width = canvas.clientWidth * ANTI_ALIASING
    ctx.height = canvas.clientHeight * ANTI_ALIASING

    cellSize = canvas.clientWidth/cote * ANTI_ALIASING
    renderFrame()
}

window.addEventListener('resize', async function(e) {
    calculateResize()
});

calculateResize()