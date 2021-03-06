class localTile{
    constructor(x,y,s){
        this.x = x
        this.y = y
        this.state = s
    }
}

window.addEventListener('resize', async function(e) {
    setBoardParameters()
});

function setBoardParameters(){
    canvas.width = canvas.clientWidth * ANTI_ALIASING
    canvas.height = canvas.clientHeight * ANTI_ALIASING

    ctx.width = canvas.clientWidth * ANTI_ALIASING
    ctx.height = canvas.clientHeight * ANTI_ALIASING

    cellSize = canvas.clientWidth/cote * ANTI_ALIASING
    renderNormalFrame()
}

let mouseX, mouseY
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = Math.ceil((event.clientX - rect.left)*ANTI_ALIASING/cellSize);
    mouseY = Math.ceil((event.clientY - rect.top)*ANTI_ALIASING/cellSize);
}

canvas.addEventListener('mousedown', function (e) {

    getMousePosition(canvas, e)

    if(dict[mouseX][mouseY]!==null || localBoard[mouseX + ' ' + mouseY]){

        socket.emit('add-tile', mouseX, mouseY, null)
        localBoard[mouseX + " " + mouseY] = null

        var audio = new Audio('/audio/add.mp3');
        audio.volume = 0.2
    } else {
        console.log('add tile')
        socket.emit('add-tile', mouseX, mouseY, true)
        localBoard[mouseX + " " + mouseY] = new localTile(mouseX, mouseY, true)

        var audio = new Audio('/audio/remove.mp3');
    }
    audio.play();
    renderNormalFrame()
})

setBoardParameters()