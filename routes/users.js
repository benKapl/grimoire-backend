var express = require('express');
var router = express.Router();

const User = require("../models/users")

// const { checkBody } = require("../modules/checkBody")

// router.get('/', function(req, res, next) {
//   res.send('users');
// });

router.post("/", async (req, res) => {
    const { username } = req.body
    console.log(username)
    const newUser = await User.create({ 
      username: username.toLowerCase(),
    })
    res.json("created")
})

module.exports = router;