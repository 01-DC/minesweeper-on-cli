#!/usr/bin/env node
const readline = require('readline')
const minesweeperPretty = require("./minesweeper-pretty")
const minesweeperAscii = require("./minesweeper-ascii")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const prompt = (query) => new Promise((resolve) => rl.question(query, resolve))

let width= 10
let height= 10
let mines= 10
let pretty= false

function getArg(args, name) {
    const match= args.match(new RegExp('--' + name + '=(\\d+)'))

    if(match === null)
        return null

    return parseInt(match[1])
}

function readArgs() {
    try {
        const args= process.argv.slice(2).join(' ')
        width= getArg(args, 'size') || width
        height= getArg(args, 'size') || height
        mines= getArg(args, 'mines') || mines

        if(width<1 || height<1)
            throw new Error('Field size must be positive')
    } catch(e) {
        console.error(e)
        process.exit(1)
    }
}

async function ask() {
    const ans = await prompt("Are these emojis visible? '🧱 💣 1️⃣ ' (Y/N)  ")
    readArgs()
    if(ans.toLowerCase() === 'y')
        pretty= true
    else if(ans.toLowerCase() === 'n')
        pretty = false
    else
        console.log("Invalid choice. Defaulting to ascii mode.")
    
    if(pretty)
        minesweeperPretty(width, height, mines)
    else
        minesweeperAscii(width, height, mines)
}

ask()
