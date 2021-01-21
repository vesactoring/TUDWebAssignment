var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Pressing the 'Play' button, return this page */
router.get("/play", function(req, res) {
  res.sendFile("game.html", { root: "./public"});
});

module.exports = router;
