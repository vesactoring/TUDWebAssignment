var state = false //false if no piece has been selected
var captureAvaibality = false;
var mustMovePiece = [];
var captureCoordinate = [];
var side = false; // false is white, true is black
var currentPiece;
var currentCell;
var isInitialised = false;

if (!isInitialised) {
    var start = new Initiate();
    start;
    isInitialised = true;
}


var cells = document.getElementsByClassName("tile"); 
for (var i = 0; i < cells.length; i++) { 
   cells[i].onclick = function(){
       selectTile(this);
   };
}

function selectTile(that) {
    if (!state && that.innerHTML == "") return; // if the select tile has no pieces => return, do nothing

    if(!state) { //no piece selected
        // if (captureAvaibality) {

        //     return;
        // }
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
        canCapture(that);
        side = swap(side);
        // console.log("Is there any piece around? " + isTherePieceAround(that));
        // Change status line
        changeStatusLine();
    }
}

/**
 * This function will return true if the move is valid, false otherwise
 * @param {*} oldCell: the selected piece to be moved
 * @param {*} newCell: the new cell that the piece will be in
 * @param {*} side: false => white, true => black
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
    // console.log(canCapture(newCell));

    if (!side) {
        if (isValidMoveWhite(x_coordinate, y_coordinate, oldCell, newCell)) return true;
    } else {
        if (isValidMoveBlack(x_coordinate, y_coordinate, oldCell, newCell)) return true;
    }

    return false;
}

/**
 * This fucntion check if the move is valid for white piece
 * @param {*} x_coordinate: horizontal axix
 * @param {*} y_coordinate: vertical axis
 * @param {*} pieceSelected: the cell contain the piece
 * @param {*} newCell: the cell which the piece will move to
 */
function isValidMoveWhite(x_coordinate, y_coordinate, pieceSelected, newCell) {
    if (pieceSelected.innerHTML.charAt(76) != 'w') return false;
    if (captureAvaibality) {
        if (!mustMovePiece.includes(pieceSelected)) return false;
        if (captureCoordinate.includes(newCell.id)) {
            console.log(x_coordinate[1] + " " + y_coordinate[1]);
            let temp = (parseInt(newCell.id.substring(0,1)) + x_coordinate[1]) / 2;
            let temp2 = (parseInt(newCell.id.substring(2, 3)) + y_coordinate[1]) / 2;
            capture(document.getElementById(temp + "_" + temp2));
            captureCoordinate = [];
            mustMovePiece = [];
            captureAvaibality = false;
            return true;
        }
        return false;
    }
    if (x_coordinate[0] != x_coordinate[1]  &&  y_coordinate[0] - y_coordinate[1] == 1 && newCell.innerHTML == "") {
        // canCapture(newCell);
        return true;
    }
    return false;
}

/**
 * This fucntion check if the move is valid for black piece
 * @param {*} x_coordinate: horizontal axix
 * @param {*} y_coordinate: vertical axis
 * @param {*} pieceSelected: the cell contain the piece
 * @param {*} newCell: the cell which the piece will move to
 */
function isValidMoveBlack(x_coordinate, y_coordinate, pieceSelected, newCell) {
    if (pieceSelected.innerHTML.charAt(76) != 'b') return false;
    // canCapture(newCell);
    if (captureAvaibality) {
        if (!mustMovePiece.includes(pieceSelected)) return false;
        if (captureCoordinate.includes(newCell.id)) {
            console.log(x_coordinate[1] + " " + y_coordinate[1]);
            let temp = (parseInt(newCell.id.substring(0,1)) + x_coordinate[1]) / 2;
            let temp2 = (parseInt(newCell.id.substring(2, 3)) + y_coordinate[1]) / 2;
            capture(document.getElementById(temp + "_" + temp2));
            captureCoordinate = [];
            mustMovePiece = [];
            captureAvaibality = false;
            return true;
        }
        return false;
    }
    if (x_coordinate[0] != x_coordinate[1] && y_coordinate[0] - y_coordinate[1] == -1 && newCell.innerHTML == "") {
        // canCapture(newCell);
        return true;
    }
    return false;
}

/**
 * The piece getting captured get obliterated from the board
 * @param {*} x 
 */
function capture(x) {
    x.innerHTML = "";
}

function canCapture(pieceSelected) {
    if (!isTherePieceAround(pieceSelected)) return;
    // let x = parseInt(pieceSelected.id.substring(0, 1));
    // let y = parseInt(pieceSelected.id.substring(2,3));
    // console.log(leftBelow(pieceSelected).innerHTML);
    if (side && (rightBelow(pieceSelected).charAt(76) == "w" || leftBelow(pieceSelected).charAt(76) == 'w' || rightAhead(pieceSelected).charAt(76) == 'w' || leftAhead(pieceSelected).charAt(76) == 'w')) {
        if (leftBelow(pieceSelected).charAt(76) == 'w') {
            let enemyTile = document.getElementById(leftBelow(pieceSelected).substring(65, 67)).parentNode;

            let xEnemyTile = parseInt(enemyTile.id.substring(0, 1)) + 2;
            let yEnemyTile = parseInt(enemyTile.id.substring(2,3)) + 2;
            let checkAvailability = document.getElementById(xEnemyTile + "_" + yEnemyTile); 
            
            if (checkAvailability.innerHTML == "") {
                captureAvaibality = true;
                mustMovePiece.push(enemyTile);
                captureCoordinate.push(checkAvailability.id);
            }
        }
        if (rightBelow(pieceSelected).charAt(76) == 'w') {
            let enemyTile = document.getElementById(rightBelow(pieceSelected).substring(65, 67)).parentNode;

            let xEnemyTile = parseInt(enemyTile.id.substring(0, 1)) - 2;
            let yEnemyTile = parseInt(enemyTile.id.substring(2,3)) + 2;

            let checkAvailability = document.getElementById(xEnemyTile + "_" + yEnemyTile); 
            if (checkAvailability.innerHTML == "") {
                captureAvaibality = true;
                mustMovePiece.push(enemyTile);
                captureCoordinate.push(checkAvailability.id);
            }
        }
        if (rightAhead(pieceSelected).charAt(76) == 'w') {
            let enemyTile = document.getElementById(rightAhead(pieceSelected).substring(65, 67)).parentNode;

            let xEnemyTile = parseInt(enemyTile.id.substring(0, 1)) - 2;
            let yEnemyTile = parseInt(enemyTile.id.substring(2,3)) - 2;
            console.log(enemyTile);
            let checkAvailability = document.getElementById(xEnemyTile + "_" + yEnemyTile); 
            
            if (checkAvailability.innerHTML == "") {
                captureAvaibality = true;
                mustMovePiece.push(enemyTile);
                captureCoordinate.push(checkAvailability.id);
            }
        }
        if (leftAhead(pieceSelected).charAt(76) == 'w') {
            let enemyTile = document.getElementById(leftAhead(pieceSelected).substring(65, 67)).parentNode;

            let xEnemyTile = parseInt(enemyTile.id.substring(0, 1)) + 2;
            let yEnemyTile = parseInt(enemyTile.id.substring(2,3)) - 2;

            let checkAvailability = document.getElementById(xEnemyTile + "_" + yEnemyTile); 
            if (checkAvailability.innerHTML == "") {
                captureAvaibality = true;
                mustMovePiece.push(enemyTile);
                captureCoordinate.push(checkAvailability.id);
            }
        }
    } else if (!side && (rightBelow(pieceSelected).charAt(76) == "b" || leftBelow(pieceSelected).charAt(76) == 'b' || rightAhead(pieceSelected).charAt(76) == 'b' || leftAhead(pieceSelected).charAt(76) == 'b')) {
        if (rightAhead(pieceSelected).charAt(76) == 'b') {
            let enemyTile = document.getElementById(rightAhead(pieceSelected).substring(65, 67)).parentNode;

            let xEnemyTile = parseInt(enemyTile.id.substring(0, 1)) - 2;
            let yEnemyTile = parseInt(enemyTile.id.substring(2,3)) - 2;
            console.log(enemyTile);
            let checkAvailability = document.getElementById(xEnemyTile + "_" + yEnemyTile); 
            
            if (checkAvailability.innerHTML == "") {
                captureAvaibality = true;
                mustMovePiece.push(enemyTile);
                captureCoordinate.push(checkAvailability.id);
            }
        }
        if (leftAhead(pieceSelected).charAt(76) == 'b') {
            let enemyTile = document.getElementById(leftAhead(pieceSelected).substring(65, 67)).parentNode;

            let xEnemyTile = parseInt(enemyTile.id.substring(0, 1)) + 2;
            let yEnemyTile = parseInt(enemyTile.id.substring(2,3)) - 2;

            let checkAvailability = document.getElementById(xEnemyTile + "_" + yEnemyTile); 
            if (checkAvailability.innerHTML == "") {
                captureAvaibality = true;
                mustMovePiece.push(enemyTile);
                captureCoordinate.push(checkAvailability.id);
            }
        }  
        if (leftBelow(pieceSelected).charAt(76) == 'b') {
            let enemyTile = document.getElementById(leftBelow(pieceSelected).substring(65, 67)).parentNode;

            let xEnemyTile = parseInt(enemyTile.id.substring(0, 1)) + 2;
            let yEnemyTile = parseInt(enemyTile.id.substring(2,3)) + 2;
            console.log(enemyTile);
            let checkAvailability = document.getElementById(xEnemyTile + "_" + yEnemyTile); 
            
            if (checkAvailability.innerHTML == "") {
                captureAvaibality = true;
                mustMovePiece.push(enemyTile);
                captureCoordinate.push(checkAvailability.id);
            }
        }
        if (rightBelow(pieceSelected).charAt(76) == 'b') {
            let enemyTile = document.getElementById(rightBelow(pieceSelected).substring(65, 67)).parentNode;

            let xEnemyTile = parseInt(enemyTile.id.substring(0, 1)) - 2;
            let yEnemyTile = parseInt(enemyTile.id.substring(2,3)) + 2;

            let checkAvailability = document.getElementById(xEnemyTile + "_" + yEnemyTile); 
            if (checkAvailability.innerHTML == "") {
                captureAvaibality = true;
                mustMovePiece.push(enemyTile);
                captureCoordinate.push(checkAvailability.id);
            }
        }     
    }
    
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
 * This function check if the area around the selected piece has any other pieces
 * @param {*} selectedPiece 
 * @return true if there are there are, false otherwise
 */
function isTherePieceAround(pieceSelected) {
    let x = parseInt(pieceSelected.id.substring(0, 1));
    let y = parseInt(pieceSelected.id.substring(2,3));

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

function rightAhead(pieceSelected) {
    let x = parseInt(pieceSelected.id.substring(0, 1));
    let y = parseInt(pieceSelected.id.substring(2,3));

    let xRight = x + 1;
    let yAhead = y + 1;
    let rightAhead;

    if (xRight >= 0 && xRight <= 9 && yAhead >=0 && yAhead <= 9)
    rightAhead = document.getElementById(xRight + "_" + yAhead).innerHTML;
    else rightAhead = "";

    if (rightAhead != "") {
        return document.getElementById(xRight + "_" + yAhead).innerHTML;
    }
    return "";
}

function leftAhead(pieceSelected) {
    let x = parseInt(pieceSelected.id.substring(0, 1));
    let y = parseInt(pieceSelected.id.substring(2,3));

    let xLeft = x - 1;
    let yAhead = y + 1;

    let leftAhead;
    if (xLeft >= 0 && xLeft <= 9 && yAhead >= 0 && yAhead <= 9)
    leftAhead = document.getElementById(xLeft + "_" + yAhead).innerHTML;
    else leftAhead = "";

    if (leftAhead != "") return document.getElementById(xLeft + "_" + yAhead).innerHTML;

    return "";
}

function rightBelow(pieceSelected) {
    let x = parseInt(pieceSelected.id.substring(0, 1));
    let y = parseInt(pieceSelected.id.substring(2,3));

    let xRight = x + 1;
    let yBelow = y - 1;

    let rightBelow;

    if (xRight >= 0 && xRight <= 9 && yBelow >=0 && yBelow <= 9)
    rightBelow = document.getElementById(xRight + "_" + yBelow).innerHTML;
    else rightBelow = "";

    if (rightBelow != "") return document.getElementById(xRight + "_" + yBelow).innerHTML;

    return "";
}

function leftBelow(pieceSelected) {
    let x = parseInt(pieceSelected.id.substring(0, 1));
    let y = parseInt(pieceSelected.id.substring(2,3));
    
    let xLeft = x - 1;
    let yBelow = y - 1;
    let leftBelow;
    if (xLeft >= 0 && xLeft <= 9 && yBelow >= 0 && yBelow <= 9)
    leftBelow = document.getElementById(xLeft + "_" + yBelow).innerHTML;
    else leftBelow = "";

    if(leftBelow != "") return document.getElementById(xLeft + "_" + yBelow).innerHTML;

    return "";
}

/**
 * This function change the status bar in the bottom, to notify which side is playing next
 */
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