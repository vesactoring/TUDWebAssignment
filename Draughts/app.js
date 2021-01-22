// First setup //
var express = require("express");
var http = require("http");
var websocket = require("ws");
var app = express();
var indexRouter = require("./routes/index");
// First setup //

// Redirect to the game //
var port = process.argv[2];
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.get("/play", indexRouter);
// Redirect to the game //
app.get("/", (req, res) => {
  res.render("index", {
    gamesInitialized: ongoingGame,
    gamesCompleted: gameFinished,
  })
});

// Create Websocket on server-side //
var server = http.createServer(app);
const wss = new websocket.Server({ server });
// Create Websocket on server-side //

// Open connection //
var id = 2, online = 0, ongoingGame = 0, gameFinished = 0, userList = [];
// To throw away the index 0 and 1 of the array
userList.push("trash");
userList.push("trash");

wss.on("connection", function (ws) {
  userList.push(ws); // 0; 1
  online++;
  ws.id = ++id; // 1; 2 - 2
  console.log("New Connection " + online);
  console.log(gameFinished + " number of game which finished");
  ws.send(JSON.stringify({
    message: "newConnection",
  }))

  if (online % 2 == 0) {
    ongoingGame++;
    userList[ws.id - 2].send(JSON.stringify({
      message: "initialise",
      side: "w",
      turn: true,
    }))
    userList[ws.id - 1].send(JSON.stringify({
      message: "initialise",
      side: "b",
      turn: false,
    }))
  }

  ws.on("close", () => {
    online--;
    console.log("New Disconnection " + ws.id);
    if (ws.id % 2 == 0) {
      if (userList[ws.id - 2] == undefined) return;
      userList[ws.id - 2].send(JSON.stringify({
        message: "abort",
      }))
      ongoingGame--;
    } else {
      if (userList[ws.id] == undefined) return;
      userList[ws.id].send(JSON.stringify({
        message: "abort",
      }))
    }
  });

  ws.onmessage = (message) => {
    // let op = socketList[opponent];
    const data = JSON.parse(message.data);

    if (data.hasFinish == "I win") {
      gameFinished++;
      ongoingGame--;
      if (ws.id % 2 == 0) { // 4 -> 2, 3
        userList[ws.id - 2].send(JSON.stringify({
          message: "loser",
        }))
        userList[ws.id - 1].send(JSON.stringify({
          message: "winner",
        }))
      } else {
        // 3 -> 2, 3
        userList[ws.id].send(JSON.stringify({
          message: "loser",
        }))
        userList[ws.id - 1].send(JSON.stringify({
          message: "winner",
        }))
      }
  }

  if (data.canCapture) {
    if (ws.id % 2 == 0) {
      userList[ws.id - 2].send(JSON.stringify({
        from: data.from,
        to: data.to,
        die: data.die,
        piece: data.piece,
        turn: false,
      }))
      userList[ws.id - 1].send(JSON.stringify({
        turn: true,
      }))
    } else {
      userList[ws.id].send(JSON.stringify({
        from: data.from,
        to: data.to,
        die: data.die,
        piece: data.piece,
        turn: false,
      }))
      userList[ws.id - 1].send(JSON.stringify({
        turn: true,
      }))
    }
  } else {
    if (ws.id % 2 == 0) {
      userList[ws.id - 2].send(JSON.stringify({
        from: data.from,
        to: data.to,
        die: data.die,
        piece: data.piece,
        turn: true,
      }))
      userList[ws.id - 1].send(JSON.stringify({
        turn: false,
      }))
    } else {
      userList[ws.id].send(JSON.stringify({
        from: data.from,
        to: data.to,
        die: data.die,
        piece: data.piece,
        turn: true,
      }))
      userList[ws.id - 1].send(JSON.stringify({
        turn: false,
      }))
    }
  }
}
})

// Open Connection //
server.listen(port);
console.log("server is running");