var board = document.getElementById("DraughtBoard");
var tile = document.getElementsByClassName("tile");
alert("Test");
console.log("test");
var map = [
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
];

for (let i = 0; i < 100; i++) {
    var containerWhite = document.createElement('div');
    var containerBlack = document.createElement('div');
    var piecesWhite = document.createElement("img");
    var piecesBlack = document.createElement('img');
    piecesWhite.src = "../images/white.png";
    piecesWhite.setAttribute("style", "width: 90%; margin-top: 30%"); 
    piecesBlack.src = "../images/black.png";
    piecesBlack.setAttribute("style", "width: 90%; margin-top: 30%");
    
    if (map[i] == 1 && i < 50) {
        containerBlack.appendChild(piecesBlack);
        tile[i].appendChild(containerBlack);
    } else if (map[i] == 1 && i > 50) {
        containerWhite.appendChild(piecesWhite);
        tile[i].appendChild(containerWhite);
    }
}