/**
 * This function is used to start the game, add pieces to the board
 */
function initiateGame() {
    // To turn off the onlick attribute in "Start Game" button
    var startGameButton = document.getElementById('initiate');
    startGameButton.removeAttribute("onclick");
    startGameButton.remove();

    // Change the "Start game" text to "It's your turn" text
    var turn = document.getElementById('turn');
    var attribute = document.createElement("strong");
    var newText = document.createTextNode("It's your turn");
    attribute.appendChild(newText);
    turn.appendChild(attribute);

    var tile = document.getElementsByClassName("tile");
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
        // To create a div containing white pieces
        var containerWhite = document.createElement('div');
        containerWhite.setAttribute("style", "position: Absolute, width: 90%; cursor: pointer");
        if (i > 50)
            containerWhite.setAttribute("id", i);

        // To create a div containing black pieces
        var containerBlack = document.createElement('div');
        containerBlack.setAttribute("style", "position: Absolute, width: 90%; cursor: pointer;");
        containerBlack.setAttribute("onclick", "test()");
        if (i < 50)
            containerBlack.setAttribute("id", i);

        // White piece (png image)
        var piecesWhite = document.createElement("img");
        piecesWhite.src = "../images/white.png";
        piecesWhite.setAttribute("style", "width: 90%; margin-top: 30%");

        // Black piece (png image)
        var piecesBlack = document.createElement('img');
        piecesBlack.src = "../images/black.png";
        piecesBlack.setAttribute("style", "width: 90%; margin-top: 30%");

        // Add the pieces to the board
        if (map[i] == 1 && i < 50) {
            containerBlack.appendChild(piecesBlack);
            tile[i].appendChild(containerBlack);
        } else if (map[i] == 1 && i > 50) {
            containerWhite.appendChild(piecesWhite);
            tile[i].appendChild(containerWhite);
        }
    }
}

function move() {
    var source = document.getElementById("1");
    var destination = document.getElementById("8_6");
    destination.getCh
    destination.appendChild(source);
}