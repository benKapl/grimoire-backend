require('../models/connection');
var express = require('express');
var router = express.Router();
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');




// router.get('/', function(req, res, next) {
//   res.send('users');
// });

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        profilePic: req.body.profilePic | null,
        isDark: false,
        //devLang: 'dev_1',
        
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, username: newDoc.username });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post("/", async (req, res) => {
    const { username } = req.body
    console.log(username)
    const newUser = await User.create({ 
      username: username.toLowerCase(),
    })
    res.json("created")
})

module.exports = router;