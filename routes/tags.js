var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody")
const Tag = require("../models/tags")

router.get('/', function(req, res, next) {
  res.send('tags');
});

module.exports = router;
