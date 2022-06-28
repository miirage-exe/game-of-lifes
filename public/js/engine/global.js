

socket.on('canvas:set-tile', (x, y, v)=> {
    addTile(x,y,v)
    localBoard[x + " " + y] = undefined
    renderNormalFrame()
})

socket.emit('usr-ask:can-edit', (res)=>{
    canEdit=res;
})

socket.on('progress:chaos-phase', (duration, framerate, board)=> {
    canEdit = false
})
socket.on('progress:preparation-phase', (board)=> {
    dict = board;
    runSim = false
    setTimeout(()=>{
        renderNormalFrame()
        console.log('rendu server')
        canEdit = true
    }, 100)
})

// socket.on('chaos-phase:launch-simulation', (NumFrame, framerate, board)=> {
//     console.log
//     runSim = true
//     runGame(NumFrame, framerate)
// })

socket.on('render:board', (board)=> {
    console.log('got it')
    dict = board
    renderNormalFrame()
})


generateEmpty()