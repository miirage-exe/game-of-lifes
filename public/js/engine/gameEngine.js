const gameToken = window.location.href.split('/')[window.location.href.split('/').length - 1]

const socket = io('/game/' + gameToken);

socket.on('canvas:set-tile', (x, y, v)=> {
    addTile(x,y,v)
})

socket.on('launch-sim', (duration, framerate)=> {
    console.log(duration, framerate)
    runGame(duration, framerate)
})


canvas.addEventListener('mousedown', function (e) {

    getMousePosition(canvas, e)

    if(dict[mouseX][mouseY]!==null){
        socket.emit('user:set-tile', mouseX, mouseY, null)
        var audio = new Audio('/audio/add.mp3');
        audio.volume = 0.2
    } else {
        socket.emit('user:set-tile', mouseX, mouseY, true)
        var audio = new Audio('/audio/remove.mp3');
    }
    audio.play(); 
    renderFrame()
})

generateEmpty()