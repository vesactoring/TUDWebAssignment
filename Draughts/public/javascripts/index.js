// Establish connection //
const ws = new WebSocket("ws://localhost:3000");
// Establish connection //

var newGame = new Game(); // to start an instance of new game
var selected = false; //false if no piece has been selected
var currentPiece;
var currentCell;
var side; // Side which the client plays from
var checkTurn; // Check if it is the client's turn
var die = -1; // to kill (capture) a piece
die.id = -1; // itsselectedselected
var captureAvailability = false; // true if there are pieces available to be captured by the client
var mustMoveTo = []; // array to store 
var mustMoveFrom = [];
var pieceCaptured = 20;

var cells = document.getElementsByClassName("tile");
function move() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = () => {
            selectTile(cells[i]);
        };
    }
}
move();

function selectTile(that) {
    if (!selected && that.innerHTML.charAt(76) !== side )
        return; // if the select tile has no pieces => return, do nothing

    if (!selected && !checkTurn)
        return; // if it's not your turn

    if (!selected) { //no piece selected
        selected = true; //piece has been selected
        currentPiece = that.innerHTML; //get the current piece selected
        currentCell = that; //get the current cell selection
    } else { //else, you are moving a piece
        scanForCaptureAvalability();

        if (!isValidMove(currentCell.id, that.id, currentPiece)) {
            changeHeaderLine("Invalid Move!!!!");
            newGame.playSound("InvalidMove.mp3");
            selected = false;
            return;
        }
        selected = false; //piece has been placed, so set selected back to false
        changeHeaderLine("your move sucks kek (jk)");
        newGame.playSound("NormalMove.wav");
        promoteKing(that, currentPiece);
        ws.send(JSON.stringify({
            message: "move",
            from: currentCell.id,
            die: die.id,
            to: that.id,
            piece: currentPiece,

        }));
        let remove = document.getElementById(die.id);
        update(currentCell, that, remove, currentPiece);
        if (pieceCaptured == 0) {
            ws.send(JSON.stringify({
                hasFinish: "I win",
            }))
        }
        die = -1;
        die.id = -1;
        scanForCaptureAvalability();
        ws.send(JSON.stringify({
            canCapture: captureAvailability
        }));

    }
}

function update(from, to, die, piece) {
    if (from != null)
    from.innerHTML = "";
    if (to != null)
    to.innerHTML = piece;
    // if (die != null)
    die.innerHTML = "";
}

function isValidMove(from, to, piece) {
    let temp = document.getElementById(to);
    if (to === from || temp.className == "tile") return false;

    x_coordinate = [parseInt(to.substring(0, 1)), parseInt(from.substring(0, 1))];
    y_coordinate = [parseInt(to.substring(2, 3)), parseInt(from.substring(2, 3))];

    if (captureAvailability) {
        if (!mustMoveFrom.includes(from) || !mustMoveTo.includes(to)) {
            return false;
        }
        for (let i = 0; i < mustMoveFrom.length; i++) {
            if (mustMoveFrom[i] == from && mustMoveTo[i] == to) {
                let killX = (x_coordinate[0] + x_coordinate[1]) / 2;
                let killY = (y_coordinate[0] + y_coordinate[1]) / 2;
                die = document.getElementById(killX + "_" + killY);
                mustMoveFrom = [];
                mustMoveTo = [];
                captureAvailability = false;
                pieceCaptured--;
                newGame.playSound("CaptureSound.wav");
                return true;
            }
        }
        return false;
    }

    if (x_coordinate[0] != x_coordinate[1] && y_coordinate[0] - y_coordinate[1] == 1 && temp.innerHTML == "" && side == "w" && piece.charAt(77) !== "w") {
        return true;
    } else if (x_coordinate[0] != x_coordinate[1] && y_coordinate[0] - y_coordinate[1] == -1 && temp.innerHTML == "" && side == "b" && piece.charAt(77) !== "b") {
        return true;
    } else if (x_coordinate[0] != x_coordinate[1] && temp.innerHTML == "" && piece.charAt(77) == "k" && y_coordinate[0] != y_coordinate[1]) {
        return true;
    }
    return false;
}

function scanForCaptureAvalability() {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML.charAt(76) == side) {
            lookForCaptureAvailability(cells[i].id);
        }
    }
}

function lookForCaptureAvailability(check) {
    let position = document.getElementById(check);

    if (canCaptureRightAhead(position))
        captureAvailability = true;
    if (canCaptureLeftAhead(position))
        captureAvailability = true;
    if (canCaptureRightBelow(position))
        captureAvailability = true;
    if (canCaptureLeftBelow(position))
        captureAvailability = true;
}

function canCaptureRightAhead(position) {
    let x = parseInt(position.id.substring(0, 1)) + 1;
    let y = parseInt(position.id.substring(2, 3)) + 1;
    let toCheck = document.getElementById(x + "_" + y);
    if (toCheck == null) return false;
    if (toCheck.innerHTML.charAt(76) !== side && toCheck.innerHTML != "" && isTileAvailableForCapture(x - 1, y - 1, x, y)) {
        mustMoveFrom.push(position.id);
        return true;
    }
    return false;
}

function canCaptureLeftAhead(position) {
    let x = parseInt(position.id.substring(0, 1)) - 1;
    let y = parseInt(position.id.substring(2, 3)) + 1;
    let toCheck = document.getElementById(x + "_" + y);
    if (toCheck == null) return false;
    if (toCheck.innerHTML.charAt(76) !== side && toCheck.innerHTML != "" && isTileAvailableForCapture(x + 1, y - 1, x, y)) {
        mustMoveFrom.push(position.id);
        return true;
    }
    return false;
}

function canCaptureRightBelow(position) {
    let x = parseInt(position.id.substring(0, 1)) + 1;
    let y = parseInt(position.id.substring(2, 3)) - 1;
    let toCheck = document.getElementById(x + "_" + y);
    if (toCheck == null) return false;
    if (toCheck.innerHTML.charAt(76) !== side && toCheck.innerHTML != "" && isTileAvailableForCapture(x - 1, y + 1, x, y)) {
        mustMoveFrom.push(position.id);
        return true;
    }
    return false;
}

function canCaptureLeftBelow(position) {
    let x = parseInt(position.id.substring(0, 1)) - 1;
    let y = parseInt(position.id.substring(2, 3)) - 1;
    let toCheck = document.getElementById(x + "_" + y);
    if (toCheck == null) return false;
    if (toCheck.innerHTML.charAt(76) !== side && toCheck.innerHTML != "" && isTileAvailableForCapture(x + 1, y + 1, x, y)) {
        mustMoveFrom.push(position.id);
        return true;
    }
    return false;
}

function isTileAvailableForCapture(yourX, yourY, opX, opY) {
    let x = 2 * opX - yourX;
    let y = 2 * opY - yourY;

    let tile = document.getElementById(x + "_" + y);
    if (tile == null) return false;
    if (tile.innerHTML == "") {
        mustMoveTo.push(tile.id);
        return true;
    }
    return false;
}

function promoteKing(to, piece) {
    if (side == "w", to.id.substring(2,3) == "9") {
        let containerWhiteKing = document.createElement("div");
        containerWhiteKing.setAttribute("style", "position: Absolute, width: 90%; cursor: pointer");
        containerWhiteKing.setAttribute("id", piece.substring(65, 67));
        containerWhiteKing.setAttribute("class", "wk");
        let whiteKingPiece = document.createElement("img");
        whiteKingPiece.src = "../images/whiteking.png";
        whiteKingPiece.setAttribute("style", "width: 90%; margin-top: 30%");
        containerWhiteKing.appendChild(whiteKingPiece);
        currentPiece = containerWhiteKing.outerHTML;
    } else if (side == "b", to.id.substring(2,3) == "0") {
        let containerWhiteKing = document.createElement("div");
        containerWhiteKing.setAttribute("style", "position: Absolute, width: 90%; cursor: pointer");
        containerWhiteKing.setAttribute("id", piece.substring(65, 67));
        containerWhiteKing.setAttribute("class", "bk");
        let whiteKingPiece = document.createElement("img");
        whiteKingPiece.src = "../images/blackking.png";
        whiteKingPiece.setAttribute("style", "width: 90%; margin-top: 30%");
        containerWhiteKing.appendChild(whiteKingPiece);
        currentPiece = containerWhiteKing.outerHTML;
    }
    return;
}

function changeStatusLine(checkTurn) {
    let turn = document.getElementById("turn");
    if (checkTurn == true) {
        turn.innerHTML = "";
        let attribute = document.createElement("strong");
        let newText;
        if (side == "w") newText = document.createTextNode("Your Turn");
        else if (side == "b") {
            newText = document.createTextNode("Your Turn");
            attribute.setAttribute("style", "color: white");
            turn.setAttribute("style", "background: black");
        }
        attribute.appendChild(newText);
        turn.appendChild(attribute);
    } else if (checkTurn == false) {
        turn.innerHTML = "";
        let attribute = document.createElement("strong");
        let newText;
        if (side == "w") newText = document.createTextNode("Waiting for Opponent...");
        else if (side == "b") {
            newText = document.createTextNode("Waiting for Opponent...");
            attribute.setAttribute("style", "color: white");
            turn.setAttribute("style", "background: black");
        }
        attribute.appendChild(newText);
        turn.appendChild(attribute);
    } else if (checkTurn == "Dis") {
        turn.innerHTML = "";
        let attribute = document.createElement("strong");
        let newText;
        if (side == "w") newText = document.createTextNode("OPPONENT DISCONNECTED - GAME ABORT");
        else if (side == "b") {
            newText = document.createTextNode("OPPONENT DISCONNECTED - GAME ABORT");
            attribute.setAttribute("style", "color: white");
            turn.setAttribute("style", "background: black");
        }
        attribute.appendChild(newText);
        turn.appendChild(attribute);
    } else if (checkTurn == "loser") {
        turn.innerHTML = "";
        let attribute = document.createElement("strong");
        let newText;
        if (side == "w") newText = document.createTextNode("TAKE THE L");
        else if (side == "b") {
            newText = document.createTextNode("TAKE THE L");
            attribute.setAttribute("style", "color: white");
            turn.setAttribute("style", "background: black");
        }
        attribute.appendChild(newText);
        turn.appendChild(attribute);
    } else if (checkTurn == "winner") {
        turn.innerHTML = "";
        let attribute = document.createElement("strong");
        let newText;
        if (side == "w") newText = document.createTextNode("YOU WON");
        else if (side == "b") {
            newText = document.createTextNode("YOU WON");
            attribute.setAttribute("style", "color: white");
            turn.setAttribute("style", "background: black");
        }
        attribute.appendChild(newText);
        turn.appendChild(attribute);
    }
}

function changeHeaderLine(message) {
    let turn = document.getElementById("header");
    turn.innerHTML = "";
    let attribute = document.createElement("strong");
    let newText;
    if (side == "w") newText = document.createTextNode(message);
    else if (side == "b") {
        newText = document.createTextNode(message);
        attribute.setAttribute("style", "color: white");
        turn.setAttribute("style", "background: black");
    }
    attribute.appendChild(newText);
    turn.appendChild(attribute);
}

// Receive response from the Server
ws.onmessage = (message) => {
    let temp = JSON.parse(message.data);

    if (temp.message == "abort") {
        newGame.abort();
        ws.onclose = () => { };
        ws.close();
    }
    if (temp.message == "initialise") {
        newGame.initialise(temp.side);
        side = temp.side;
    } else if (temp.turn !== undefined)
        changeStatusLine(temp.turn);
    checkTurn = temp.turn;
    update(document.getElementById(temp.from), document.getElementById(temp.to), document.getElementById(temp.die), temp.piece);

    if (temp.message == "loser") {
        newGame.playSound("Loser.wav");
        newGame.finish(temp.message);
        ws.onclose = () => { };
        ws.close();
    } else if (temp.message == "winner") {
        newGame.playSound("Winner.wav");
        newGame.finish(temp.message);
        ws.onclose = () => { };
        ws.close();
    }
}

