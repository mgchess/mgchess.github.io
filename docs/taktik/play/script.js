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

function initColors(){
    let runnerMatrix = [];
    for(let y=0;y<8;y++){
        runnerMatrix[y] = [];
        for(let x=0;x<8;x++){
            runnerMatrix[y][x] = (x+y)%2===0 ? "L" : "l";
        }
    }
    return runnerMatrix;
}
let colorMatrix = initColors();
let baseColorMatrix = initColors();


const board = document.getElementById("board");

let selected = null;
let activePlayer = "white";
let winner = null;
let lastMove = null;
let promotionPending = false;
const moveHistory = [];
const moveList = [];

// 🖼️ Render
function drawBoard(){

    board.innerHTML = "";

    for(let y=0;y<8;y++){
        for(let x=0;x<8;x++){

            const square = document.createElement("div");
            square.className = "square";
            if (isStandard) {
                square.style.background = style.board[colorMatrix[y][x]];
            } else {
                square.style.background = style.board[baseColorMatrix[y][x]];
            }

            const piece = boardMatrix[y][x];
if (piece && isStandard) {

    const imgPath = style.pieces[piece];

    if(imgPath){

        const img = document.createElement("img");
        img.src = imgPath;
        square.appendChild(img);

    } else {

        console.warn(
            "Keine Grafik für Figur:",
            piece
        );

    }

}
            // Zahlen links
            if (x === 0) {
                const rank = document.createElement("span");
                rank.className = "rankLabel";
                rank.textContent = 8 - y;
                square.appendChild(rank);
            }
            // Buchstaben unten
            if (y === 7) {
                const file = document.createElement("span");
                file.className = "fileLabel";
                file.textContent = "ABCDEFGH"[x];
                square.appendChild(file);
            }
            // 🖱️ CLICK
            square.onclick = () => handleClick(x, y);

            board.appendChild(square);
        }
    }
}


// 🧠 Click Handler
function handleClick(x, y){

    if(selected === null){

        if(boardMatrix[y][x] !== ""){
            selected = {x, y};
            move(x, y);
            drawBoard();
        }

    } else {

        const from = selected;

        const c = colorMatrix[y][x];

        if(c === "m" || c === "M" || c === "t" || c === "T"){

            boardMatrix[y][x] = boardMatrix[from.y][from.x];
            boardMatrix[from.y][from.x] = "";

            moveList.push(
                squareName(from.x, from.y) + squareName(x, y)
             );
            console.log(moveList);
            const playedMove =
    squareName(from.x, from.y) + squareName(x,y);

moveList.push(playedMove);


if(puzzleMode){

    if(playedMove === puzzleSolution[puzzleStep]){

        puzzleStep++;

        console.log("Richtiger Zug!");

        if(puzzleStep === puzzleSolution.length){

            console.log("🎉 Aufgabe gelöst!");
            puzzleMode = false;

        }

    } else {

        console.log("❌ Falscher Zug");

    }

}

        }

        selected = null;
        resetColors();
        drawBoard();
    }
}


// 🔄 Reset Colors
function resetColors(){
    colorMatrix = initColors();
}
const hasMoved = [];

function initHasMoved(){
    for(let y=0;y<8;y++){
        hasMoved[y] = [];
        for(let x=0;x<8;x++){
            hasMoved[y][x] = false;
        }
    }
}

initHasMoved();

function isWhitePiece(piece){
    return piece !== "" && piece === piece.toUpperCase();
}

function pieceColor(piece){
    return isWhitePiece(piece) ? "white" : "black";
}

function opponent(color){
    return color === "white" ? "black" : "white";
}

function setMoved(from, to){
    hasMoved[to.y][to.x] = true;
    hasMoved[from.y][from.x] = false;
}

function switchTurn(){
    activePlayer = opponent(activePlayer);
    updateClockDisplay();
}

function formatTime(totalSeconds){
    const safe = Math.max(0, totalSeconds);
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updateClockDisplay(){
    const whiteClock = document.querySelector(".whiteClock");
    const blackClock = document.querySelector(".blackClock");

    if(whiteClock){
        whiteClock.textContent = formatTime(window.clocks.white);
        whiteClock.classList.toggle("activeClock", activePlayer === "white" && !winner);
    }

    if(blackClock){
        blackClock.textContent = formatTime(window.clocks.black);
        blackClock.classList.toggle("activeClock", activePlayer === "black" && !winner);
    }
}

let clockInterval = null;

function startClock(){
    clearInterval(clockInterval);

    clockInterval = setInterval(() => {
        if (winner) return;
        
        if (activePlayer === "white") {
            window.clocks["white"]--;
        } else {
            window.clocks["black"]--;
        }
        if (window.clocks[activePlayer] <= 0) {
            window.clocks[activePlayer] = 0;
            winner = opponent(activePlayer);
            updateGameStatus(`${winner === "white" ? "Weiss" : "Schwarz"} gewinnt auf Zeit`);
            clearInterval(clockInterval);
        }

        updateClockDisplay();
    }, 1000);
}

function move(x, y){

    resetColors();

    const piece = boardMatrix[y][x];
    if(!piece) return;

    const isWhite = piece === piece.toUpperCase();

    function inBounds(nx, ny){
        return nx >= 0 && nx < 8 && ny >= 0 && ny < 8;
    }

    function isEnemy(nx, ny){
        const target = boardMatrix[ny][nx];
        return target !== "" && (target === target.toUpperCase()) !== isWhite;
    }

    function isEmpty(nx, ny){
        return boardMatrix[ny][nx] === "";
    }

    function mark(nx, ny){
        if(!inBounds(nx, ny)) return;

        if(isEmpty(nx, ny)){
            colorMatrix[ny][nx] = (nx+ny)%2===0 ? "M" : "m";
        } 
        else if(isEnemy(nx, ny)){
            colorMatrix[ny][nx] = (nx+ny)%2===0 ? "T" : "t";
        }
    }

    function markCastle(nx, ny){
        if(!inBounds(nx, ny)) return;
        colorMatrix[ny][nx] = (nx+ny)%2===0 ? "M" : "m";
    }

    function ray(dx, dy){
        let nx = x + dx;
        let ny = y + dy;

        while(inBounds(nx, ny)){

            if(isEmpty(nx, ny)){
                colorMatrix[ny][nx] = (nx+ny)%2===0 ? "M" : "m";
            } 
            else {
                if(isEnemy(nx, ny)){
                    colorMatrix[ny][nx] = (nx+ny)%2===0 ? "T" : "t";
                }
                break;
            }

            nx += dx;
            ny += dy;
        }
    }


    switch(piece.toLowerCase()){

        // ♟️ PAWN (korrekt)
        case "b": {

            let dir = isWhite ? -1 : 1;
            let startRow = isWhite ? 6 : 1;

            // 1 Schritt
            if(inBounds(x, y + dir) && isEmpty(x, y + dir)){
                mark(x, y + dir);

                // 2 Schritte nur vom Startfeld und nur vor dem ersten Zug
                if(y === startRow && !hasMoved[y][x] && inBounds(x, y + 2*dir) && isEmpty(x, y + 2*dir)){
                    mark(x, y + 2*dir);
                }
            }

            // Schlagen
            [-1, 1].forEach(dx => {
                let nx = x + dx;
                let ny = y + dir;

                if(inBounds(nx, ny) && isEnemy(nx, ny)){
                    mark(nx, ny);
                }
            });

            // En passant
            if(lastMove && lastMove.piece.toLowerCase() === "b" && Math.abs(lastMove.to.y - lastMove.from.y) === 2){
                const enemyPawnNextToUs = lastMove.to.y === y && Math.abs(lastMove.to.x - x) === 1;
                if(enemyPawnNextToUs){
                    mark(lastMove.to.x, y + dir);
                }
            }

            break;
        }


        // ♜ ROOK
        case "t":
            [[1,0],[-1,0],[0,1],[0,-1]].forEach(d => ray(d[0], d[1]));
            break;

        // ♝ BISHOP
        case "l":
            [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(d => ray(d[0], d[1]));
            break;

        // ♛ QUEEN
        case "d":
            [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]
                .forEach(d => ray(d[0], d[1]));
            break;

        // ♞ KNIGHT
        case "s":
            [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]]
                .forEach(d => mark(x+d[0], y+d[1]));
            break;

        // ♚ KING
        case "k":
            [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]
                .forEach(d => mark(x+d[0], y+d[1]));

            // Rochade: Koenig und Turm ungezogen, Felder dazwischen frei
            if(!hasMoved[y][x]){
                if(boardMatrix[y][7] && boardMatrix[y][7].toLowerCase() === "t" && !hasMoved[y][7] && isEmpty(5, y) && isEmpty(6, y)){
                    markCastle(6, y);
                }
                if(boardMatrix[y][0] && boardMatrix[y][0].toLowerCase() === "t" && !hasMoved[y][0] && isEmpty(1, y) && isEmpty(2, y) && isEmpty(3, y)){
                    markCastle(2, y);
                }
            }
            break;
    }
}

function pieceName(piece){
    const names = {
        b: "",
        t: "T",
        s: "S",
        l: "L",
        d: "D",
        k: "K"
    };
    return names[piece.toLowerCase()] || "";
}

function squareName(x, y){
    return `${"abcdefgh"[x]}${8 - y}`;
}

function updateMaterial(){
    const values = {b: 1, s: 3, l: 3, t: 5, d: 9, k: 0};
    let white = 0;
    let black = 0;

    for(let y=0;y<8;y++){
        for(let x=0;x<8;x++){
            const piece = boardMatrix[y][x];
            if(!piece) continue;

            if(isWhitePiece(piece)){
                white += values[piece.toLowerCase()] || 0;
            } else {
                black += values[piece.toLowerCase()] || 0;
            }
        }
    }

    const diff = white - black;
    const whiteMaterial = document.querySelector(".whiteClock + .material");
    const blackMaterial = document.querySelector(".blackClock + .material");

    if(whiteMaterial) whiteMaterial.textContent = diff > 0 ? `+${diff}` : "+0";
    if(blackMaterial) blackMaterial.textContent = diff < 0 ? `+${Math.abs(diff)}` : "+0";
}

function loadFEN(fen){

    const position = fen.split(" ");
    const rows = position[0].split("/");

    for(let y = 0; y < 8; y++){

        boardMatrix[y] = [];

        for(let char of rows[y]){

            if(!isNaN(char)){

                for(let i = 0; i < Number(char); i++){
                    boardMatrix[y].push("");
                }

            } else{

    const fenMap = {
        "P":"B",
        "p":"b",

        "R":"T",
        "r":"t",

        "N":"S",
        "n":"s",

        "B":"L",
        "b":"l",

        "Q":"D",
        "q":"d",

        "K":"K",
        "k":"k"
    };


    boardMatrix[y].push(
        fenMap[char]
    );

}
        }
    }

    activePlayer =
        position[1] === "w"
        ? "white"
        : "black";


    moveList.length = 0;
    selected = null;

    drawBoard();

}

drawBoard();