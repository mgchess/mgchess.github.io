// ===== Einstellungen =====
const depth = 10;
const moves = 50;

// ===== starten =====
const engine = new Worker("stockfish-18-lite-single.js");
engine.postMessage("uci");
engine.postMessage(`setoption name MultiPV value ${moves}`);
engine.postMessage("isready");

// ===== Brett zu FEN =====
const pieceMap = {
    "T": "R",
    "S": "N",
    "L": "B",
    "D": "Q",
    "K": "K",
    "B": "P",
    "t": "r",
    "s": "n",
    "l": "b",
    "d": "q",
    "k": "k",
    "b": "p"
};

function boardToFen(board, color) {
    let fen = "";
    for (let y = 0; y < 8; y++) {
        let empty = 0;
        for (let x = 0; x < 8; x++) {
            let piece = board[y][x];
            if (piece === "") {
                empty++;
            } else {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                fen += pieceMap[piece];
            }
        }
        if (empty > 0) {
            fen += empty;
        }
        if (y !== 7) {
            fen += "/";
        }
    }
    return `${fen} ${color[0]} - - 0 1`;
}

// ===== Analyse =====
function analyseMoves(pos, color) {
    return new Promise(resolve => {
        let results = [];
        engine.onmessage = event => {
            const line = event.data;
            if (
                line.startsWith("info") &&
                line.includes("multipv")
            ) {
                const number = line.match(/multipv (\d+)/);
                const score = line.match(/score cp (-?\d+)/);
                const pv = line.match(/pv ([a-h][1-8][a-h][1-8][qrbn]?)/);
                if (number && score && pv) {
                    results[Number(number[1]) - 1] = {
                        move: pv[1],
                        score: Number(score[1])
                    };
                }
            }
            if (line.startsWith("bestmove")) {
                resolve(results.filter(Boolean));
            }
        };
        const fen = boardToFen(pos, color);
        engine.postMessage(
            "position fen " + fen
        );
        engine.postMessage(
            "go depth " + depth
        );
    });
}