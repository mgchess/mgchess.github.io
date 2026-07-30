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
            afterMove: "start",
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
            afterMove: moveList[i],
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


const moves = await analyseMoveList(
    moveList,
    "white"
);

console.log("Alle Analysen:");
console.log(moves);