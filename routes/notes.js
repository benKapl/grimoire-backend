var express = require('express');
var router = express.Router();
// const moment = require('moment');

const { checkBody } = require('../modules/checkBody');
const Note = require('../models/notes');
const User = require('../models/users');

/** Get all note with title and ids*/
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

/** Create note from its ID in database */
router.get('/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    console.log(noteId);
    if (!noteId) throw new Error('Invalid ID');

    const note = await Note.findById(noteId);

    if (!note) throw new Error('Could not get note');
    res.json({ result: true, note: note });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

/** Create a new note in database */
router.post('/', async (req, res) => {
  const isBodyValid = checkBody(req.body, ['token']);
  if (!isBodyValid) throw new Error('Missing or empty body parameter');

  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    console.log(user);
    if (!user) throw new Error('User not found');

    const newNote = await Note.create({
      title: 'Nouvelle note',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: '',
      forwardNotes: [],
      backwardNotes: [],
      isBookmarked: false,
      isPrivate: true,
      user: user._id,
    });

    if (!newNote) throw new Error('Could not create stack');
    res.json({ result: true, note: newNote });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
