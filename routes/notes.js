var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody")
const Note = require("../models/notes")

router.get('/', function(req, res, next) {
  res.send('notes');
});


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
      console.error('Error fetching notes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
