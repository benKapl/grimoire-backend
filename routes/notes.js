var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody")
const Note = require("../models/notes")

router.get('/', function(req, res, next) {
  res.send('notes');
});

module.exports = router;
