const {randomUUID} = require('crypto')
module.exports = class{
    constructor(){
        return {
            _id: randomUUID(),
        }
    }
}