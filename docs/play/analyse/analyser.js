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
const moves = await analyseMoves(boardMatrix);
console.log(moves);