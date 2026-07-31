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
function levelMoves(analysis) {
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


function drawBoard(){

    const board =
        document.getElementById("board");


    board.innerHTML="";


    for(let y=0;y<8;y++){

        for(let x=0;x<8;x++){


            const square =
                document.createElement("div");


            square.className="square";


            // gleiche Farben wie dein Spiel
            square.style.background =
                style.board[colorMatrix[y][x]];



            const piece =
                boardMatrix[y][x];


            if(piece){

                const img =
                    document.createElement("img");


                img.src =
                    style.pieces[piece];


                square.appendChild(img);
            }



            // Zahlen links
            if(x===0){

                const rank =
                    document.createElement("span");

                rank.className="rankLabel";
                rank.textContent =
                    8-y;

                square.appendChild(rank);
            }



            // Buchstaben unten
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