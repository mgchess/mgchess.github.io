// test-definitions
const boardMatrix = [
    ["t","s","l","d","k","l","s","t"],
    ["b","b","b","b","b","b","b","b"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["B","B","B","B","B","B","B","B"],
    ["T","S","L","D","K","L","S","T"]
];

const moveList = [
    "e2e4",
    "e7e5",
    "g1f3",
    "b8c6",
    "f1c4"
];

//list-analyzer
async function analyseMoveList(moveList, color = "white") {
    const allResults = [];
    let board = structuredClone(boardMatrix);
    if (color === "white") {
        const startResult = await analyseMoves(board);
        console.log(
            "Beste Züge für Weiß (Startstellung):"
        );
        console.log(startResult);
        allResults.push({
            afterMove: moveList[0],
            moves: startResult
        });
    }
    for (let i = 0; i < moveList.length; i++) {
        board = applyMove(board, moveList[i]);
        const nextIsWhite = (i + 1) % 2 === 0;
        if (
            (color === "white" && !nextIsWhite) ||
            (color === "black" && nextIsWhite)
        ) {
            continue;
        }
        const result = await analyseMoves(board);
        console.log(
            `Beste Züge für ${color} nach ${moveList[i]}:`
        );
        console.log(result);
        allResults.push({
            afterMove: moveList[i + 1],
            moves: result
        });
    }
    return allResults;
}

function applyMove(board, move) {
    const fromX = move.charCodeAt(0) - 97;
    const fromY = 8 - Number(move[1]);
    const toX = move.charCodeAt(2) - 97;
    const toY = 8 - Number(move[3]);
    const newBoard = structuredClone(board);
    newBoard[toY][toX] = newBoard[fromY][fromX];
    newBoard[fromY][fromX] = "";
    return newBoard;
}

//rater
function levelMoves(moveList, analysis) {
    const levels = [];
    for (const item of analysis) {
        const playedMove = item.afterMove;
        const bestMoves = item.moves;
        const index = bestMoves.findIndex(
            m => m.move === playedMove
        );
        let level;
        let txt;
        if (index === 0) {
            level = 1;
            txt = "perfect";
        } else if (index >= 1 && index <= 2) {
            level = 2;
            txt = "genius";
        } else if (index >= 3 && index <= 9) {
            level = 3;
            txt = "very smart";
        } else if (index >= 10 && index <= 19) {
            level = 4;
            txt = "smart";
        } else if (index >= 20 && index <= 34) {
            level = 5;
            txt = "neutral";
        } else if (index >= 35 && index <= 49) {
            level = 6;
            txt = "bad";
        } else {
            level = 7;
            txt = "very bad";
        }
        levels.push({
            level: level,
            txt: txt
        });
    }
    return levels;
}

//test
const moves = await analyseMoveList(
    moveList,
    "white"
);
console.log("Alle Analysen:");
console.log(moves);
const leveledMoves = levelMoves(moveList, moves);
console.log("gelevelte Analyse:");
console.log(leveledMoves);