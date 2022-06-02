#! usr/bin/env node
const minesweeperPretty = require("./minesweeper-pretty")
const minesweeperAscii = require("./minesweeper-ascii")

const getArg = (args, name) => {
    const match= args.match(new RegExp('--' + name + '=(\\d+)'))

    if(match === null)
        return null

    return parseInt(match[1])
}

let width= 10
let height= 10
let mines= 10

try {
    const args= process.argv.slice(2).join(' ')
    width= getArg(args, 'width') || width
    height= getArg(args, 'height') || height
    mines= getArg(args, 'mines') || mines

    if(width<1 || height<1)
        throw new Error('Field size must be positive')
} catch(e) {
    console.error(e)
    process.exit(1)
}

minesweeperPretty(width, height, mines)