let puzzles = [];

let currentPuzzle = null;

let puzzleSolution = [];

let puzzleStep = 0;

let puzzleMode = false;

let puzzlesLoaded = false;



// Wird durch Button aufgerufen
function runBestmove(){


    if(!puzzlesLoaded){


        fetch("../../src/db/bestmove/puzzles_0001.csv")

        .then(response => response.text())

        .then(csv => {


            puzzles = parseCSV(csv);


            puzzlesLoaded = true;


            loadRandomPuzzle();


        })


        .catch(error => {

            console.error(
                "CSV konnte nicht geladen werden:",
                error
            );

        });



    }

    else {


        loadRandomPuzzle();


    }

}



// CSV lesen
function parseCSV(csv){

    const data = Papa.parse(csv,{
        header:true,
        skipEmptyLines:true
    }).data;


    console.log("Spalten:", Object.keys(data[0]));


    return data.map(puzzle => {

        return {
            id: puzzle.PuzzleId,
            fen: puzzle.FEN,
            moves: puzzle.Moves
        };

    }).filter(puzzle => 
        puzzle.fen && puzzle.moves
    );

}


// Zufälliges Puzzle starten
function loadRandomPuzzle(){



    currentPuzzle =
        puzzles[
            Math.floor(
                Math.random()*puzzles.length
            )
        ];



    console.log(
        "Puzzle",
        currentPuzzle
    );



    puzzleMode = true;


    puzzleStep = 0;



    puzzleSolution =
        currentPuzzle.moves.split(" ");



    /*
       Lichess:

       erster Zug ist schon der Gegnerzug

    */


    loadFEN(
        currentPuzzle.fen
    );



    setTimeout(()=>{

        playOpponentMove();

    },500);



}




// Gegnerzug automatisch spielen
function playOpponentMove(){



    if(
        puzzleStep >= puzzleSolution.length
    ){

        finishPuzzle();

        return;

    }



    let move =
        puzzleSolution[puzzleStep];



    movePiece(move);



    puzzleStep++;



}




// Zug auf deinem Brett ausführen
function movePiece(move){



    let fromX =
        "abcdefgh".indexOf(move[0]);


    let fromY =
        8 - Number(move[1]);



    let toX =
        "abcdefgh".indexOf(move[2]);


    let toY =
        8 - Number(move[3]);




    boardMatrix[toY][toX] =
        boardMatrix[fromY][fromX];



    boardMatrix[fromY][fromX]="";



    drawBoard();


}




// Von deinem handleClick aufrufen
function checkPuzzleMove(move){



    if(!puzzleMode)
        return;




    let correct =
        puzzleSolution[puzzleStep];



    if(move === correct){



        console.log(
            "Richtig!"
        );



        puzzleStep++;



        if(
            puzzleStep >= puzzleSolution.length
        ){


            finishPuzzle();


        }

        else {


            setTimeout(()=>{

                playOpponentMove();


            },500);


        }



    }

    else {


        console.log(
            "Falsch!"
        );


    }


}




// Aufgabe fertig
function finishPuzzle(){



    puzzleMode=false;



    console.log(
        "Puzzle gelöst!"
    );



    setTimeout(()=>{


        loadRandomPuzzle();


    },1000);



}