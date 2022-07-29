module.exports.durationPrepa = 10*1000

module.exports.simulation_framerate = 12
module.exports.simulation_framesPerCycle = 128 // Number of frame rendered per cycle
module.exports.simulation_duration = module.exports.simulation_framesPerCycle*1000/module.exports.simulation_framerate // Duration during one cycle (ms)

module.exports.board_sideLength = 64 // Nombre de cellules sur chaque coté