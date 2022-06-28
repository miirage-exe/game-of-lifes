

socket.on('canvas:set-tile', (x, y, v)=> {
    addTile(x,y,v)
    localBoard[x + " " + y] = undefined
    renderNormalFrame()
})

socket.emit('usr-ask:can-edit', (res)=>{
    canEdit=res;
})

socket.on('progress:chaos-phase', ()=> {
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

socket.on('chaos-phase:launch-simulation', (NumberOfFrames, EndDate, board)=> {
    dict = board
    renderSimulationFrame()
    runSim = true
    console.log('time left :'+(NumberOfFrames*((EndDate-Date.now())/NumberOfFrames)))
    console.log('must finish at :'+ EndDate)
    runGame(NumberOfFrames, (EndDate-Date.now())/NumberOfFrames)
})

generateEmpty()