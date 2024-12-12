const mongoose = require("mongoose")

const notesSchema = mongoose.Schema({
    title: String,
<<<<<<< HEAD
    blocs: [ mongoose.Schema.Types.Mixed ],
=======
    createdAt: { type: Date, index: true },
    updatedAt: { type: Date, index: true },
    blocs: [ { type: mongoose.Schema.Types.ObjectId, ref: 'blocs' } ],
>>>>>>> ac09e9275d65335c7cbbec6c60c8696b4f2429ab
    forwardNotes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'notes' } ], 
    backwardNotes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'notes' } ], 
    isBookmarked: Boolean,
    isPrivate: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true }
}, {
    timestamps: true
});

const Note = mongoose.model("notes", notesSchema);

module.exports = Note