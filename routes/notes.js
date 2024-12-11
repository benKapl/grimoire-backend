var express = require('express');
var router = express.Router();
// const moment = require('moment');

const { checkBody } = require('../modules/checkBody');
const Note = require('../models/notes');
const User = require('../models/users');

/* Get all note with title and ids/*/
router.get('/user/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: 'User not found' });
    }

    const notes = await Note.find({ user: user._id });

    res.json({
      result: true,
      notes: notes.map((note) => ({
        id: note._id,
        title: note.title,
      })),
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

/** GET note from its ID in database */
router.get('/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    // console.log(noteId);
    if (!noteId) throw new Error('Invalid ID');

    const note = await Note.findById(noteId).populate("blocs");

    if (!note) throw new Error('Could not get note');
    res.json({ result: true, note: note });
  } catch (err) { 
    res.json({ result: false, error: err.message });
  }
});

/** Create a new note in database */
router.post("/", async (req, res) => {
  const isBodyValid = checkBody(req.body, ["token"]);
  if (!isBodyValid) throw new Error("Missing or empty body parameter")
  
  try  {
    const { token } = req.body

    const user = await User.findOne({ token })
    if (!user) throw new Error("User not found")

    const newNote = await Note.create({
      title: 'Nouvelle note',
      createdAt: new Date(), 
      updatedAt: new Date(),
      blocs: [],
      forwardNotes: [],
      backwardNotes: [],
      isBookmarked: false,
      isPrivate: true,
      user: user._id,
    });

    if (!newNote) throw new Error('Could not create note');
    res.json({ result: true, note: newNote });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

/** Save note when modified*/
router.put("/", async (req, res) => {
  const isBodyValid = checkBody(req.body, ["noteId"]);
  if (!isBodyValid) throw new Error("Missing or empty body parameter")
  try {
    const { noteId, noteData } = req.body

    const note = await Note.updateOne({ _id: noteId }, {
      title: noteData.title,
      updatedAt: Date.now(),
      // blocs: noteData.blocs,
    });
    res.json({ result: true })

  } catch(err) {
    res.json({ result: false, error: err.message })
  }
})

router.get('/search/:query', async (req, res, next)=> {
  try {
      const query = req.params.query;
      
      // Vérifier si query est vide
      if (!query) {
          return res.status(400).json({ message: 'Query is required' });
      }

      // Utiliser une expression régulière pour une recherche partielle (insensible à la casse)
      const notes = await Note.find({
          title: { $regex: `^${query}`, $options: 'i' } // 'i' rend la recherche insensible à la casse
      });

      res.status(200).json(notes);
  } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
