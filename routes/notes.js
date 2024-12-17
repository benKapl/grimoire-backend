var express = require('express');
var router = express.Router();
const moment = require('moment');

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

    const note = await Note.findById(noteId).populate('blocs');

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
    if (!user) throw new Error('User not found');

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
router.put('/', async (req, res) => {
  const isBodyValid = checkBody(req.body, ['noteId']);
  if (!isBodyValid) throw new Error('Missing or empty body parameter');
  try {
    const { noteId, noteData } = req.body;

    const note = await Note.updateOne(
      { _id: noteId },
      {
        title: noteData.title,
        updatedAt: Date.now(),
        // blocs: noteData.blocs,
      }
    );
    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.delete('/delete/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    if (!noteId) {
      return { result: false, error: 'Invalid ID' };
    }
    // Trouve la note avant de la supprimer
    const noteToDelete = await Note.findById(noteId);
    if (!noteToDelete) {
      return { result: false, error: 'Note not found' };
    }
    // Supprime la note
    await Note.deleteOne({ _id: noteId });
    res.json({
      result: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res
      .status(500)
      .json({ result: false, error: 'Internal Server Error' });
  }
});

/** Get note by Title*/
router.get('/search/:query/:token', async (req, res, next) => {
  if (req.params.query === '') {
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  try {
    const { token } = req.params;
    const query = req.params.query;

    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: 'User not found' });
    }

    // Vérifier si query est vide
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Utiliser une expression régulière pour une recherche partielle (insensible à la casse)
    const notes = await Note.find({
      user: user._id,
      title: { $regex: `^${query}`, $options: 'i' }, // 'i' rend la recherche insensible à la casse
    });
    console.log('Notes fetched:', notes);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/** Get note by date*/
router.post('/by/date', async (req, res) => {
  console.log("back 1");
  checkBody(req.body, ['token','date']);
  
  try {
    const date = new Date(req.body.date);
    
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Début de la journée
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Fin de la journée

    const notes = await Note.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });

    if (notes.length === 0) {
      console.log('No notes found with this date.');
      return res.json({ result: true, notes: [] });
    }

    const notesList = notes.map((note) => {
      return {
        id: note._id,
        title: note.title,
      };
    });

    res.json({ result: true, notes: notesList });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

/** Get note by updated */
router.post('/by/update', async (req, res) => {
  checkBody(req.body, ['date']);

  try {
    const date = new Date(req.body.date);

    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Début de la journée
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Fin de la journée

    const notes = await Note.find({
      updatedAt: { $gte: startOfDay, $lt: endOfDay },
    });

    //console.log("notes :", notes)
    if (notes.length === 0) {
      console.log('No notes found with this date.');
      return res.json({ result: true, notes: [] });
    }

    const notesList = notes
      .filter(
        (note) =>
          note.createdAt.getDate() !== note.updatedAt.getDate() ||
          note.createdAt.getMonth() !== note.updatedAt.getMonth() ||
          note.createdAt.getFullYear() !== note.updatedAt.getFullYear()
      )
      .map((note) => {
        return {
          id: note._id,
          title: note.title,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        };
      });

    res.json({ result: true, notes: notesList });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.put('/addfavorites/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    if (!noteId) {
      return { result: false, error: 'Invalid ID' };
    }
    const noteToToggleFavorite = await Note.findById(noteId);
    if (!noteToToggleFavorite) {
      return { result: false, error: 'Note not found' };
    }
    // Inverse l'état de "isBookmarked"
    noteToToggleFavorite.isBookmarked = !noteToToggleFavorite.isBookmarked;
    await noteToToggleFavorite.save();

    res.json({
      result: true,
      id: noteToToggleFavorite._id,
      title: noteToToggleFavorite.title,
      isBookmarked: noteToToggleFavorite.isBookmarked,
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

/* Get all note favorites and ids/*/
router.get('/favorites/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: 'User not found' });
    }

    const favorites = await Note.find({ user: user._id, isBookmarked: true });

    res.json({
      result: true,

      favorites: favorites.map((favorite) => ({
        id: favorite._id,
        title: favorite.title,
        isBookmarked: favorite.isBookmarked,
      })),
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

/* Get the related Note */
router.get('/linked/forward/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;

    const notes = await Note.findById(noteId).populate('forwardNotes');
    if (!notes) throw new Error('Could note find note');

    res.json({
      result: true,
      forwardNotes: notes.forwardNotes.map((note) => ({
        id: note._id,
        title: note.title,
      })),
    });
  } catch (err) {
    res.json({ restult: false, error: err.message });
  }
});

module.exports = router;
