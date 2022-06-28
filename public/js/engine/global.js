

socket.on('canvas:set-tile', (x, y, v)=> {
    addTile(x,y,v)
    localBoard[x + " " + y] = undefined
    renderNormalFrame()
})

socket.on('launch-sim', (duration, framerate)=> {
    console.log(duration, framerate)
    runGame(duration, framerate)
})




generateEmpty()