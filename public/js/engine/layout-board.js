
var cote = 64;
var ANTI_ALIASING = 3
var padding = 0;

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
ctx.width = canvas.clientWidth 
ctx.height = canvas.clientHeight

var cellSize = Math.floor(canvas.clientWidth/cote);

function renderModel(model=Function){
    for (let f = 0; f < 5; f++) {
        model()
    }
}

function fillTile(x,y){
    ctx.clearRect((x)*cellSize, (y)*cellSize,cellSize, cellSize)
    renderModel(()=>{ctx.fillRect(((x)*cellSize) + cellSize*padding, ((y)*cellSize) + cellSize*padding, cellSize - (cellSize*padding*2), cellSize - (cellSize*padding*2));})
}

function renderBoardSet(){
    cellSize = canvas.clientWidth/cote * ANTI_ALIASING
    for (let i = 1; i <= cote; i++) {
        for (let j = 1; j <= cote; j++) {
            if(!dict[i] || dict[i][j] === null){
                ctx.fillStyle = getBackgroundTileColor(i, j)
            } else if(dict[i][j] === false){
                ctx.fillStyle = '#6AABE9';//#white
            }else {
                ctx.fillStyle = '#DF5050';//#DF5050
            }
            fillTile(i-1 , j-1)
        }
    }

}

function renderLocalTileSet(){

    const layoutCellSize = cellSize-(2*padding*cellSize)
    const modelSize = 0.5

    for (const [key, value] of Object.entries(localBoard)) {
        const coord = key.split(" ")
        if (value !== undefined){
            console.log(getBackgroundTileColor(coord[0], coord[1]))
            value ? ctx.fillStyle = "rgba(255, 255, 255, 0.5)" : ctx.fillStyle = getBackgroundTileColor(coord[0]-1, coord[1]-1)
            renderModel(()=>{
                ctx.fillRect(((coord[0]-1)*cellSize) + cellSize*padding + ((1-modelSize)*layoutCellSize/2), ((coord[1]-1)*cellSize) + cellSize*padding + ((1-modelSize)*layoutCellSize/2), modelSize * layoutCellSize, modelSize * layoutCellSize);
            })
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

function getBackgroundTileColor(x, y){
    if((x+y)%2){
        return '#242424';//EDEDED
    } else {
        return '#181818';//white
    }
}