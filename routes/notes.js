var express = require('express');
var router = express.Router();
// const moment = require('moment');

const { checkBody } = require("../modules/checkBody")
const Note = require("../models/notes")
const User = require("../models/users")

router.post("/", async (req, res) => {
  /** Create a new note in database */
  const isBodyValid = checkBody(req.body, ["token"]);
  if (!isBodyValid) throw new Error("Missing or empty body parameter")
  
  try  {
    const token = req.body.token
    const user = await User.findOne({ token })
    console.log(user)
    if (!user) throw new Error("User not found")

    const newNote = await Note.create({ 
      title: "Nouvelle note",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: "",
      forwardNotes: [],
      backwardNotes: [],
      isBookmarked: false,
      isPrivate: true,
      user: user._id,
    })

    if (!newNote) throw new Error("Could not create stack")
    res.json({result: true, note: newNote})

  } catch(err) {
    res.json({ result: false, error: err.message})
  }
})

module.exports = router;
