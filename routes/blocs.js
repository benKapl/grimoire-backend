var express = require('express');
var router = express.Router();
// const moment = require('moment');

const { checkBody } = require('../modules/checkBody');
const Bloc = require('../models/blocs');
const Note = require('../models/notes');

/** Create a new bloc in a note */
router.post("/", async (req, res) => {
    const isBodyValid = checkBody(req.body, ["noteId", "type"]); // check only type (language can be null)
    if (!isBodyValid) throw new Error("Missing or empty body parameter")
    
    try  {
      const { noteId, type, language } = req.body

      const newBloc = await Bloc.create({
        type,
        language,
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      if (!newBloc) throw new Error('Could not create bloc');

      const updatedNote = await Note.updateOne(
        { _id: noteId }, // find related note
        { $push: { blocs: newBloc._id } } // Add the newBloc's ID to the blocs array of the Note document
      );

      if (updatedNote.modifiedCount > 0) {
        res.json({ result: true }) // if updated, respond result = true
        return;
      }
      res.json({ result: false, error: "Bloc was not linked to note" })
  
    //   const user = await User.findOne({ token })
    //   if (!user) throw new Error("User not found")
  
    //   const newNote = await Note.create({
    //     title: 'Nouvelle note'
  
    //   res.json({ result: true, note: newNote });
    } catch (err) {
      res.json({ result: false, error: err.message });
    }
  });



// /* Get all note with title and ids/*/
// router.get('/user/:token', async (req, res) => {
//     try {
//       const { token } = req.params;
  
//       const user = await User.findOne({ token });
  
//       if (!user) {
//         return res.json({ result: false, error: 'User not found' });
//       }
  
//       const notes = await Note.find({ user: user._id });
  
//       res.json({
//         result: true,
//         notes: notes.map((note) => ({
//           id: note._id,
//           title: note.title,
//         })),
//       });
//     } catch (err) {
//       res.json({ result: false, error: err.message });
//     }
//   });

module.exports = router;
