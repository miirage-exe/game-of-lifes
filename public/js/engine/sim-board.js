function calculateGenerationStep(){
    var nxtDict = {};
    var p =0;
    var pi = 0

    //first colonne ;
    // i = 0;
    nxtDict[0] = [];
    for (let j = 0; j <= cote+1; j++) {
        nxtDict[0].push(null)
    }

    for (let i = 1; i <= cote; i++) {
        nxtDict[i] = []
        nxtDict[i].push(null)
            for (let j = 1; j <= cote; j++) {
                //calcul population
                p = []
                pi=0
                for (let ik = i-1; ik <= i+1; ik++) {
                    for (let jk = j-1; jk <= j+1; jk++) {                        
                        if(dict[ik][jk] !== null){
                            p++
                            dict[ik][jk]? pi++ : null
                        }
                    }
                }
                if(dict[i][j] === null && p === 3){//cas naissance de la cellule
                    pi>1? nxtDict[i].push(true) : nxtDict[i].push(false)
                } else if (p === 4 || p === 3){// cas survie de la cellule
                    nxtDict[i].push(dict[i][j])
                } else {//cas mort de la cellule
                    nxtDict[i].push(null)
                }
            }
        nxtDict[i].push(null)
    }

    //last colonne
    // i = cote+1
    nxtDict[cote+1] = []
    for (let j = 0; j <= cote+1; j++) {
        nxtDict[cote+1].push(null)
    }

    var diff = false;
    for(let i = 1; i <=cote; i++){
        for(let j = 1; j <=cote; j++){
            if(dict[i][j]!==nxtDict[i][j]){
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

function generateEmpty(){
    for (let i = 0; i <= cote+1; i++) {
        dict[i]=[]
        for (let j = 0; j <= cote+1; j++) {
            dict[i].push(null)
        }
    }
    renderNormalFrame()
}



var simSpeed = 0
function runGame(NumFrame, framerate){

    simSpeed = framerate

    var audio = new Audio('/audio/start.mp3');
    loop(0, NumFrame)
    audio.play();

}

function loop(i, NumFrame){
    if(i<NumFrame && runSim){
        i++
        setTimeout(()=>{loop(i, NumFrame)}, simSpeed)
        calculateGenerationStep()
        renderSimulationFrame()
    } else {
        console.log(`Rendered on local until frame ${i}/${NumFrame}`)
    }
}

function addTile(x=Number, y=Number, stage=null){
    dict[x][y] = stage;
    //var audio = new Audio('/audio/remove.mp3');
    renderNormalFrame()
}

