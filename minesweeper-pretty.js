function minesweeperPretty(size, mines)
{   
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
        y>=0 && x>=0 && x<size && y<size
    ))

    const createMatrix = (v) => Array(size).fill([]).map(
        () => Array(size).fill(v)
    )

    let field = createMatrix(0)
    let uncoveredField = createMatrix(false)
    let flaggedField = createMatrix(false)

    const setMines = () => {
        let minesLeft= mines
        while(minesLeft--) {
            const mineX = Math.round(Math.random() * (size-1))
            const mineY = Math.round(Math.random() * (size-1))

            if(field[mineY][mineX] !== 'm') {
                field[mineY][mineX] = 'm'

                getNeighbouringCoords(mineX, mineY).filter(([y, x]) =>
                field[y][x] !== 'm').forEach(([y, x]) => {
                    field[y][x]++
                })
            }
        }
    }

    const checkIfWon = () => {
        return flaggedField.every(
            (row, y) => row.every(
                (cell, x) => {
                    return (cell && field[y][x] === 'm') || (!cell && field[y][x] !== 'm')
                }
            )
        )
    }

    const characterMap = {
        m: '💣',
        0: '⬜',
        1: '1️⃣ ',
        2: '2️⃣ ',
        3: '3️⃣ ',
        4: '4️⃣ ',
        5: '5️⃣ ',
        6: '6️⃣ ',
        7: '7️⃣ ',
        8: '8️⃣ ',
    }

    const renderField = (playerX, playerY) => {
        console.clear()
        console.log('🧱'.repeat(size + 2))

        for(let y=0; y<size; ++y) {
            let row= '🧱'
            for(let x=0; x<size; ++x) {
                if(x===playerX && y===playerY)
                    row+= '\x1b[47m\x1b[30m'
                
                if(flaggedField[y][x])
                    row += '🚩'
                else if(uncoveredField[y][x])
                    row+= characterMap[field[y][x]]
                else
                    row+= '  '

                if(x === playerX && y === playerY)
                    row += '\x1b[0m'
            }
            row += '🧱'
            console.log(row)
        }

        console.log('🧱'.repeat(size + 2))
        console.log('Press ENTER to uncover a field, SPACE to place a flag')
    }

    const uncoverCoords = (x, y) => {
        uncoveredField[y][x]= true

        const neighbours = getNeighbouringCoords(x, y)

        if(field[y][x] === 0)
            neighbours.forEach(([y, x]) => {
                if(uncoveredField[y][x] !== true)
                    uncoverCoords(x, y)
            })
    }

    let playerX = 0
    let playerY = 0
    let hasLost = false
    let hasWon = false
    setMines()

    renderField(playerX, playerY)

    const readlineModule = require('readline')
    readlineModule.emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)

    process.stdin.on('keypress', (character, key) => {
        if(!hasLost && !hasWon) {
            if(key.name === 'right' && playerX < size-1)
                playerX++
            
            if(key.name === 'left' && playerX > 0)
                playerX--

            if(key.name === 'down' && playerY < size-1)
                playerY++
            
            if(key.name === 'up' && playerY > 0)
                playerY--

            if(key.name === 'return') {
                uncoverCoords(playerX, playerY)
                
                if(field[playerY][playerX] === 'm') {
                    hasLost = true
                    uncoveredField = Array(size).fill([]).map(() => Array(size).fill(true))
                }
            }

            if(key.name === 'space') {
                flaggedField[playerY][playerX] = !flaggedField[playerY][playerX]
                hasWon = checkIfWon()
            }
        } else {
            if(key.name === 'return') {
                field= createMatrix(0)
                uncoveredField= createMatrix(false)
                flaggedField= createMatrix(false)
                playerX= 0
                playerY= 0
                hasLost= false
                hasWon= false
                setMines()
            }
        }

        renderField(playerX, playerY)

        if(hasLost) {
            console.log('Lost :(\n')
            console.log('Press ENTER to play again? (Ctrl+C to abort)')
        }
        
        if(hasWon) {
            console.log('Won :)\n')
            console.log('Press ENTER to play again? (Ctrl+C to abort)')
        }
        
        if(key.name === 'c' && key.ctrl)
            process.exit(0)
    })
}

module.exports = minesweeperPretty