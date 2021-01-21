/**
 * This function is used to start the game, add pieces to the board
 */
class Initiate {
    // To turn off the onlick attribute in "Start Game" button

    // Change the "Start game" text to "It's your turn" text
    constructor() {
    let turn = document.getElementById('turn');
    let attribute = document.createElement("strong");
    let newText = document.createTextNode("It's white turn");
    attribute.appendChild(newText);
    turn.appendChild(attribute);

    let tile = document.getElementsByClassName("tile");
    console.log("test");
    let map = [
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
        let containerWhite = document.createElement('div');
        containerWhite.setAttribute("style", "position: Absolute, width: 90%; cursor: pointer");
        if (i > 50) {
            containerWhite.setAttribute("id", i);
            containerWhite.setAttribute("class", "w");
        }

        // To create a div containing black pieces
        let containerBlack = document.createElement('div');
        containerBlack.setAttribute("style", "position: Absolute, width: 90%; cursor: pointer");
        // containerBlack.setAttribute("onclick", "test()");
        if (i < 50) {
            containerBlack.setAttribute("id", i);
            containerBlack.setAttribute("class", "b");
        }

        // White piece (png image)
        let piecesWhite = document.createElement("img");
        piecesWhite.src = "../images/white.png";
        piecesWhite.setAttribute("style", "width: 90%; margin-top: 30%");

        // Black piece (png image)
        let piecesBlack = document.createElement('img');
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
}