var express = require('express');
const { v4: uuidv4 } = require("uuid");
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get("/", (req, res) => {
  res.redirect(`${uuidv4()}`);
});

router.get("/:room", (req, res) => {
  //res.render("room-alt", { roomid: req.params.room });
  res.render("room2", { roomid: req.params.room });
});

module.exports = router;
