const {randomUUID} = require('crypto')
module.exports = class{
    constructor(){
        this._id = randomUUID()
    }
}