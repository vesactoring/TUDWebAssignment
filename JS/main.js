/**
 * This function is used to start the game, add pieces to the board
 */
function initiateGame() {
    // To turn off the onlick attribute in "Start Game" button
    let startGameButton = document.getElementById('initiate');
    startGameButton.removeAttribute("onclick");
    startGameButton.remove();

    // Change the "Start game" text to "It's your turn" text
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

var state = false //false if no piece has been selected
var returnType = false;
var side = false; // false is white, true is black
var currentPiece;
var currentCell;

var cells = document.getElementsByClassName("tile"); 
for (var i = 0; i < cells.length; i++) { 
   cells[i].onclick = function(){
       getCell(this);
   };
}

function getCell(that) {
    if (!state && that.innerHTML == "") return; // if the select tile has no pieces => return, do nothing
    if(!state) { //no piece selected
        state = true; //piece has been selected
        currentPiece = that.innerHTML; //get the current piece selected
        currentCell = that; //get the current cell selection
    } else { //else, you are moving a piece
        if (!isValidMove(currentCell, that, side)) {
            state = false;
            return;
        }

        that.innerHTML = currentPiece; //Set the selected space to the piece that was grabbed

        currentCell.innerHTML = ""; //remove the piece from its old location
        state = false; //piece has been placed, so set state back to false
        side = swap(side);
        console.log("Is there any piece around? " + lookAround(x_coordinate[0], y_coordinate[0]));
        // Change status line
        changeStatusLine();
    }
}

/**
 * This function will return true if the move is valid, false otherwise
 * @param {*} oldCell: the selected piece to be moved
 * @param {*} newCell: the new cell that the piece will be in
 */
function isValidMove(oldCell, newCell, side) {
    // If the piece goes to white tiles -> instant invalid move
    if (newCell.className.charAt(5) != 'd') return false;
    // Get the coordinate
    x_coordinate = [parseInt(newCell.id.substring(0, 1)), parseInt(oldCell.id.substring(0, 1))];
    y_coordinate = [parseInt(newCell.id.substring(2, 3)), parseInt(oldCell.id.substring(2, 3))];
    // console.log(x_coordinate[1]);
    // Debug
    console.log(oldCell.id);
    console.log(newCell.id);
    console.log(side);
    console.log(oldCell.innerHTML.charAt(76));

    if (!side) {
        if (isValidMoveWhite(x_coordinate, y_coordinate, oldCell, newCell)) return true;
    } else {
        if (isValidMoveBlack(x_coordinate, y_coordinate, oldCell, newCell)) return true;
    }

    return false;
}

function isValidMoveWhite(x_coordinate, y_coordinate, pieceSelected, newCell) {
    if (pieceSelected.innerHTML.charAt(76) != 'w') return false;
    if (x_coordinate[0] != x_coordinate[1]  &&  y_coordinate[0] > y_coordinate[1] && newCell.innerHTML == "") {
        return true;
    }
    return false;
}

function isValidMoveBlack(x_coordinate, y_coordinate, pieceSelected, newCell) {
    if (pieceSelected.innerHTML.charAt(76) != 'b') return false;
    if (x_coordinate[0] != x_coordinate[1]  &&  y_coordinate[0] < y_coordinate[1] && newCell.innerHTML == "") {
        return true;
    }
    return false;
}

/**
 * X captures Y
 * @param {*} x 
 * @param {*} y 
 */
function capture(x) {
    
}

/**
 * To swap side
 * @param {boolean} side currently on 
 */
function swap(sideSwap) {
    if (sideSwap) return false;
    return true;
}

/**
 * This function check if in front of the selected piece has any other pieces
 * @param {*} selectedPiece 
 * @return true if there are there are, false otherwise
 */
function lookAround(x, y) {
    let xRight = x + 1;
    let xLeft = x - 1;
    let yAhead = y + 1;
    let yBelow = y - 1;

    let rightAhead, leftAhead, rightBelow, leftBelow;
    // console.log("Look Around:" + xAround + "_" + yAround);
    if (xRight >= 0 && xRight <= 9 && yAhead >=0 && yAhead <= 9)
    rightAhead = document.getElementById(xRight + "_" + yAhead).innerHTML;
    else rightAhead = "";
    if (xLeft >= 0 && xLeft <= 9 && yAhead >= 0 && yAhead <= 9)
    leftAhead = document.getElementById(xLeft + "_" + yAhead).innerHTML;
    else leftAhead = "";
    if (xRight >= 0 && xRight <= 9 && yBelow >=0 && yBelow <= 9)
    rightBelow = document.getElementById(xRight + "_" + yBelow).innerHTML;
    else rightBelow = "";
    if (xLeft >= 0 && xLeft <= 9 && yBelow >= 0 && yBelow <= 9)
    leftBelow = document.getElementById(xLeft + "_" + yBelow).innerHTML;
    else leftBelow = "";

    if(rightAhead != "" || leftAhead != "" || rightBelow != "" || leftBelow != "") return true;
    return false;
}

function changeStatusLine() {
    let turn = document.getElementById('turn');
    let attribute = document.createElement("strong");
    let newText;
    if (side) {
        newText =  document.createTextNode("It's black turn");
        turn.setAttribute("style", "background-color: black; color: white");
    }
    else {
        newText = document.createTextNode("It's white turn");
        turn.setAttribute("style", "background-color: white; color: black");
    }
    attribute.appendChild(newText);
    turn.innerHTML = '';
    turn.appendChild(attribute);
}