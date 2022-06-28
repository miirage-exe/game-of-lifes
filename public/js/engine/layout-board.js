
var cote = 64;
var ANTI_ALIASING = 3
var padding = 0;

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
ctx.width = canvas.clientWidth 
ctx.height = canvas.clientHeight

var cellSize = Math.floor(canvas.clientWidth/cote);



function fillTile(x,y){
    ctx.clearRect((x)*cellSize, (y)*cellSize,cellSize, cellSize)
    for (let f = 0; f < 5; f++) {
        ctx.fillRect(((x)*cellSize) + cellSize*padding, ((y)*cellSize) + cellSize*padding, cellSize - (cellSize*padding*2), cellSize - (cellSize*padding*2));
    }
}

function renderBoardSet(){
    cellSize = canvas.clientWidth/cote * ANTI_ALIASING
    for (let i = 1; i <= cote; i++) {
        for (let j = 1; j <= cote; j++) {
            if(!dict[i] || dict[i][j] === null){
                if((i+j)%2){
                    ctx.fillStyle = '#242424';//EDEDED
                } else {
                    ctx.fillStyle = '#181818';//white
                }
            } else if(dict[i][j] === false){
                ctx.fillStyle = 'white';//#a97efa
            }else {
                ctx.fillStyle = '#DF5050';//#DF5050
            }
            fillTile(i-1 , j-1)
        }
    }

}

function renderLocalTileSet(){
    for (const [key, value] of Object.entries(localBoard)) {
        const coord = key.split(" ")
        console.log("value : ", value)
        if (value !== undefined){
            ctx.fillStyle = 'green';//#a97efa
            ctx.fillRect(((coord[0]-1)*cellSize) + cellSize*padding, ((coord[1]-1)*cellSize) + cellSize*padding, cellSize - (cellSize*padding*2), cellSize - (cellSize*padding*2));
        }
    }
}

function renderSimulationFrame(){
    renderBoardSet()
}

function renderNormalFrame(){
    renderBoardSet()
    renderLocalTileSet()
}