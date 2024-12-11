var express = require('express');
var router = express.Router();
// const moment = require('moment');

const { checkBody } = require('../modules/checkBody');
const Bloc = require('../models/blocs');

/** Create a new bloc in a note */
router.post("/", async (req, res) => {
    const isBodyValid = checkBody(req.body, ["type"]); // check only type (language can be null)
    if (!isBodyValid) throw new Error("Missing or empty body parameter")
    
    try  {
      const { type, language } = req.body

      res.json({type, language})
  
    //   const user = await User.findOne({ token })
    //   if (!user) throw new Error("User not found")
  
    //   const newNote = await Note.create({
    //     title: 'Nouvelle note',
    //     createdAt: Date.now(),
    //     updatedAt: Date.now(),
    //     blocs: [{
    //       position: 0,
    //       type: "text",
    //       value: "",
    //       language: null,
    //     }],
    //     forwardNotes: [],
    //     backwardNotes: [],
    //     isBookmarked: false,
    //     isPrivate: true,
    //     user: user._id,
    //   });
  
    //   if (!newNote) throw new Error('Could not create stack');
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
