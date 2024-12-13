
var express = require('express');
var router = express.Router();

const { ObjectId } = require("mongoose").Types
const { checkBody } = require("../modules/checkBody");
const Tag = require("../models/tags");
const User = require("../models/users");
const Note = require("../models/notes");

router.post('/', async (req, res) => {
  // check if body is correct
  try {
    if (!checkBody(req.body, ["value", "token", "noteId"])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    };


    const { token, noteId, value } = req.body
    // verifier si le user existe
    const user = await User.findOne({token})
    if (!user) {
      res.json({ result: false, error: 'User not found '});
      return
    } 
    
    const tag = await Tag.findOne({ value: value, user: user._id})
    // SI LE TAG N'EXISTE PAS, ON LE CREE EN LUI AJOUTANT LA NOTE AUQUEL IL EST LIE 
    if (!tag) {
      const newTag = new Tag({
        value: value,
        user: user._id,
        notes: [noteId],
      });

    // sauvegarder le nouveau tag créé dans la BDD
      const savedTag = await newTag.save();
      if (!savedTag) throw new Error('Could not save tag');
      
      res.json({ result: true, tag: savedTag });
      return
    }
    console.log("tag", tag)

    // si le tag existe, mettre à jour le document Tag en lui rajoutant une noteId dans le tableau des notes
    if (tag.notes.includes(noteId)) {
        res.json({result: false, error: `Tag already linked with note ${noteId}`})
        return
    }

    const updatedTag = await Tag.updateOne(
      {_id: tag._id}, 
      { $push : { notes: noteId } }
    )

    if (updatedTag.modifiedCount === 0) {
      res.json({ result: false, message: "Could not link existing tag to note" });
      return
    }

    res.json({ result: true, message: "Tag updated with new note" });
    return

  } catch(error) {
    return res.json({ result: false, error: error.message });
  }
})

router.get('/:noteId', async (req,res) => {
  try {
    const { noteId } = req.params;

    const foundTags = await Tag.aggregate([
      {
        $match: {
          notes: new ObjectId(noteId)
        }
      },
      {
        $project: {
          value: 1
        }
      }
    ])

    res.json({ tags: foundTags })
  } catch(error) {
    return res.json({ result: false, error: error.message });
  }
})
module.exports = router;