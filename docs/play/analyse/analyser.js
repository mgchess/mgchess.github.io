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

// test-definitions
/*
const moveList = [
    "e2e4",
    "e7e5",
    "g1f3",
    "b8c6",
    "f1c4"
];
console.log("Alle Analysen:");
console.log(moves);
const leveledMoves = levelMoves(moves);
console.log("gelevelte Analyse:");
console.log(leveledMoves);
*/

//list-analyzer
async function analyseMoveList(moveList, color = "white") {
    const allResults = [];
    let board = structuredClone(boardMatrix);
    // Startposition abhängig von der farbe
    let startIndex = color === "white" ? 0 : 1;
    for (let i = startIndex; i < moveList.length; i += 2) {
        const playedMove = moveList[i];
        if (!playedMove) break;
        const result = await analyseMoves(board);
        allResults.push({
            afterMove: playedMove,
            moves: result
        });
        console.log(
            "Analysiert:",
            playedMove
        );
        // eigenen Zug ausführen
        board = applyMove(
            board,
            playedMove
        );
        // gegnerischen Zug ausführen
        const opponentMove = moveList[i + 1];
        if (opponentMove) {
            board = applyMove(
                board,
                opponentMove
            );
        }
        addMovesToList(
            [
                playedMove,
                opponentMove || ""
            ],
            (i / 2),

        );
        updateBoard(board);
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

function updateBoard(newBoard){
    drawBoard(newBoard);
}

function addMovesToList(moves, index, level){
    const box = document.getElementById("moves");
    const div = document.createElement("div");
    div.className="move";
    if(index % 2 === 0){
        div.textContent = `${moves[0]}`;
    } else {
        div.textContent = `${moves[1]}`;
    }
    box.appendChild(div);
}

//rater
function levelMove(item) {
    //const levels = [];
    //for (const item of analysis) {
        const playedMove = item.afterMove;
        const bestMoves = item.moves;
        const index = bestMoves.findIndex(
            m => m.move === playedMove
        );
        let level;
        let txt;
        let html;
        if (index === 0) {
            level = 1;
            txt = "perfect";
            html = "<div class='level level1'>100</div>";
        } else if (index >= 1 && index <= 2) {
            level = 2;
            txt = "genius";
            html = "<div class='level level2'>!!</div>";
        } else if (index >= 3 && index <= 9) {
            level = 3;
            txt = "very smart";
            html = "<div class='level level3'>!</div>";
        } else if (index >= 10 && index <= 19) {
            level = 4;
            txt = "smart";
            html = "<div class='level level4'>+</div>";
        } else if (index >= 20 && index <= 34) {
            level = 5;
            txt = "neutral";
            html = "<div class='level level5'>ok</div>";
        } else if (index >= 35 && index <= 49) {
            level = 6;
            txt = "bad";
            html = "<div class='level level6'>-</div>";
        } else {
            level = 7;
            txt = "very bad";
            html = "<div class='level level7'>??</div>";
        }
        /*levels.push({
            level: level,
            txt: txt,
            html: html
        });*/
    //}
    return {
        level: level,
        txt: txt,
        html: html
    };
}

function levelMoves(analysis) {
    const levels = [];
    for (const item of analysis) {
        levels.push(
            levelMove(item)
        )
    }
    return levels;
}
//brett erstellen
function initColors(){
    let matrix=[];
    for(let y=0;y<8;y++){
        matrix[y]=[];
        for(let x=0;x<8;x++){
            matrix[y][x] =
                (x+y)%2===0 ? "L" : "l";
        }
    }
    return matrix;
}
const colorMatrix = initColors();
function drawBoard(currentBoard = boardMatrix){
    const board =
        document.getElementById("board");
    board.innerHTML="";
    for(let y=0;y<8;y++){
        for(let x=0;x<8;x++){
            const square =
                document.createElement("div");
            square.className="square";
            square.style.background =
                style.board[colorMatrix[y][x]];
            const piece =
                currentBoard[y][x];
            if(piece){
                const img =
                    document.createElement("img");
                img.src =
                    style.pieces[piece];
                square.appendChild(img);
            }
            if(x===0){
                const rank =
                    document.createElement("span");
                rank.className="rankLabel";
                rank.textContent =
                    8-y;
                square.appendChild(rank);
            }
            if(y===7){
                const file =
                    document.createElement("span");
                file.className="fileLabel";
                file.textContent =
                    "ABCDEFGH"[x];
                square.appendChild(file);
            }
            board.appendChild(square);
        }
    }
}
drawBoard()

//analysieren
const moves = await analyseMoveList(
    JSON.parse(sessionStorage.getItem("moveList")),
    (JSON.parse(sessionStorage.getItem("gameDetails")).color  === 0
        ? "white"
        : "black"
    )
);
console.log("Alle Analysen:");
console.log(moves);
const leveledMoves = levelMoves(moves);
console.log("gelevelte Analyse:");
console.log(leveledMoves);