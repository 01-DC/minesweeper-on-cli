const getArg = (args, name) => {
    const match= args.match(new RegExp('--' + name + '=(\\d+)'))

    if(match == null)
        throw new Error('Missing argument' + name)

    return parseInt(match[1])
}

let width= 0
let height= 0
let mines= 0

try {
    const args= process.argv.slice(2).join(' ')
    width= getArg(args, 'width')
    height= getArg(args, 'height')
    mines= getArg(args, 'mines')

    if(width<1 || height<1)
        throw new Error('Field size must be positive')
} catch(e) {
    console.error(e)
    process.exit(1)
}

const getNeighbouringCoords = (x, y) => [
    [y, x+1],
    [y, x-1],
    [y-1, x],
    [y-1, x-1],
    [y-1, x+1],
    [y+1, x],
    [y+1, x+1],
    [y+1, x-1]
].filter(([y, x]) => (
    y>=0 && x>=0 && x<width && y<height
))

const createMatrix = v => Array(width).fill([]).map(
    () => Array(height).fill(v)
)

const field = createMatrix(0)
let uncoveredField = createMatrix(false)
const flaggedField = createMatrix(false)

