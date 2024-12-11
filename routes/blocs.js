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
  
    } catch (err) {
      res.json({ result: false, error: err.message });
    }
});

/* Get all blocs within a note */
router.get('/:noteId', async (req, res) => {
    try {
      const { noteId } = req.params;
  
      const note = await Note.findById(noteId).populate("blocs") // Find a note with all detailed blocs
      if (!note) throw new Error('Could not find note');

      res.json({ result: true, blocs: note.blocs });
    
    } catch (err) {
      res.json({ result: false, error: err.message });
    }
});

/** Save bloc when modified*/
router.put("/", async (req, res) => {
    const isBodyValid = checkBody(req.body, ["blocId", "type"]); // check only type and bloc id (language can be null, and content can be "")
    if (!isBodyValid) throw new Error("Missing or empty body parameter")
    
    try {
      const { blocId, type, language, content } = req.body
  
      const updatedBloc = await Bloc.updateOne(
        { _id: blocId }, 
        {
            type,
            language,
            content,
            updatedAt: Date.now(),
        });

      if (updatedBloc.modifiedCount > 0) {
            res.json({ result: true }) // if updated, respond result = true
            return;
          }
      res.json({ result: false, error: "could not update Bloc" })
  
    } catch(err) {
      res.json({ result: false, error: err.message })
    }
  })

module.exports = router;
