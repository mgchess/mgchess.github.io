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
let levelBoard = [
  [[], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], []]
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
async function analyseMoveList(moveListi, color) {
    const allResults = [];
    let board = structuredClone(boardMatrix);
    // Startposition abhängig von der farbe
    let startIndex = color === "white" ? 0 : 1;
    startIndex = bothSides ? 0 : startIndex;
    let moveList = moveListi;
    if (color === "black" && !bothSides) {
        board = applyMove(
            board,
            moveList[0]
        );
    }
    for (
            let i = startIndex;
            i < moveList.length;
            i += bothSides ? 2 : 2
        ) {
        const playedMove = moveList[i];
        const playedMove2 = moveList[i + 1];
        if (!playedMove) break;
        const result = await analyseMoves(
            board,
            bothSides ? "w" : color
        );
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
            playedMove,
            levelMove({
                afterMove: playedMove,
                moves: result
            }).level
        );
        let result2;
        if (bothSides) { if (playedMove2) {
            updateBoard(board);
            //analyse 2
            result2 = await analyseMoves(
                board,
                "b"
            );
            allResults.push({
                afterMove: playedMove2,
                moves: result2
            });
            console.log(
                "Analysiert:",
                playedMove2
            );
            board = applyMove(
                board,
                playedMove2,
                levelMove({
                    afterMove: playedMove2,
                    moves: result2
                }).level
            );
            addMovesToList(
                    [
                        playedMove,
                        playedMove2 || ""
                    ],
                    (i / 2),
                    [
                        levelMove({
                            afterMove: playedMove,
                            moves: result
                        }),
                        levelMove({
                            afterMove: playedMove2,
                            moves: result2
                        })
                    ],
                    "both"
                );
        }} else {
            // gegnerischen Zug ausführen
            const opponentMove = moveList[i + 1];
            if (opponentMove) {
                board = applyMove(
                    board,
                    opponentMove
               );
            }
            if (color === "white") {
                addMovesToList(
                    [
                        playedMove,
                        opponentMove || ""
                    ],
                    (i / 2),
                    levelMove({
                        afterMove: playedMove,
                        moves: result
                    }),
                    color
                );
            } else {
                addMovesToList(
                    [
                        moveList[i - 1],
                        moveList[i] || ""
                    ],
                    ((i - 1) / 2),
                    levelMove({
                        afterMove: playedMove,
                        moves: result
                    }),
                    color
                );
            }
        }
        updateBoard(board);
    }
   return allResults;
}

function applyMove(board, move, level) {
    const fromX = move.charCodeAt(0) - 97;
    const fromY = 8 - Number(move[1]);
    const toX = move.charCodeAt(2) - 97;
    const toY = 8 - Number(move[3]);
    levelBoard[toY][toX] = levelBoard[fromY][fromX];
    levelBoard[fromY][fromX] = [];
    if (level) {
        levelBoard[toY][toX].unshift(level);
    }
    const newBoard = structuredClone(board);
    newBoard[toY][toX] = newBoard[fromY][fromX];
    newBoard[fromY][fromX] = "";
    return newBoard;
}

function updateBoard(newBoard){
    drawBoard(newBoard);
}

function addMovesToList(moves, index, level, color){
    if (color === "both" ) {
        const box = document.getElementById("moves");
        const moveDiv = document.createElement("div");
        moveDiv.className="move moveB";
        let divs = [];
        for ( let i=0 ; i<4 ; i++ ) {
            divs[i] = document.createElement("div");
            moveDiv.appendChild(divs[i]);
        }
        divs[0].innerHTML = `${index + 1}. ${moves[0]}`;
        divs[1].innerHTML = `${level[0].html} <span>${level[0].txt}</span>`;
        divs[2].innerHTML = moves[1];
        divs[3].innerHTML = `${level[1].html} <span>${level[1].txt}</span>`;
        box.appendChild(moveDiv);
    } else {
        const box = document.getElementById("moves");
        const moveDiv = document.createElement("div");
        moveDiv.className="move";
        let divs = [];
        for ( let i=0 ; i<3 ; i++ ) {
            divs[i] = document.createElement("div");
            moveDiv.appendChild(divs[i]);
        }
        divs[0].innerHTML = `${index + 1}. ${moves[0]}`;
        divs[1].innerHTML = moves[1];
        divs[2].innerHTML = `${level.html} <span>${level.txt}</span>`;
        divs[color === "white" ? 0 : 1].innerHTML =
            `<b>${divs[color === "white" ? 0 : 1].innerHTML}</b>`;
        divs[color === "white" ? 0 : 1].style.color = "orange";
        box.appendChild(moveDiv);
    }
}

//rater
function levelMove(item) {
    //const levels = [];
    //for (const item of analysis) {
    let index;
    let toLevel = 99;
    if (JSON.stringify(item).trim()[0] ==="{") {
        const playedMove = item.afterMove;
        const bestMoves = item.moves;
        index = bestMoves.findIndex(
            m => m.move === playedMove
        );
    } else {
        toLevel = item;
    }
        let level;
        let txt;
        let html;
        if (index === 0 || toLevel === 1 ) {
            level = 1;
            txt = "perfect";
            html = "<div class='level level1'>100</div>";
        } else if ((index >= 1 && index <= 2) || toLevel === 2 ) {
            level = 2;
            txt = "genius";
            html = "<div class='level level2'>!!</div>";
        } else if ((index >= 3 && index <= 4) || toLevel === 3 ) {
            level = 3;
            txt = "very smart";
            html = "<div class='level level3'>!</div>";
        } else if ((index >= 5 && index <= 10) || toLevel === 4 ) {
            level = 4;
            txt = "smart";
            html = "<div class='level level4'>+</div>";
        } else if ((index >= 11 && index <= 16) || toLevel === 5 ) {
            level = 5;
            txt = "neutral";
            html = "<div class='level level5'>ok</div>";
        } else if ((index >= 17 && index <= 25) || toLevel === 6 ) {
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
            const piece = currentBoard[y][x];
            const levels = levelBoard[y][x];
            if(piece){
                const img = document.createElement("img");
                img.src = style.pieces[piece];
                const fig = document.createElement("div");
                fig.className = "pieceContainer";
                const figImg =  document.createElement("div");
                figImg.className = "pieceImage";
                figImg.appendChild(img);
                const levs = document.createElement("div");
                levs.className = "pieceLevels";
                for (
                    let i = 0;
                    i < levels.length;
                    i++
                ) {
                    let lev = document.createElement("div");
                    lev.innerHTML = levelMove(levels[i]).html;
                    levs.appendChild(lev);
                }
                fig.appendChild(figImg);
                fig.appendChild(levs);
                square.appendChild(fig);
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
    (JSON.parse(sessionStorage.getItem("gameDetails")).color  === 1
        ? "white"
        : "black"
    )
);
console.log("Alle Analysen:");
console.log(moves);
const leveledMoves = levelMoves(moves);
console.log("gelevelte Analyse:");
console.log(leveledMoves);