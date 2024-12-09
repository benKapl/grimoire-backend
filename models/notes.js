const mongoose = require("mongoose")

const notesSchema = mongoose.Schema({
    title: String,
    createdAt: { type: Date, index: true },
    updatedAt: { type: Date, index: true },
    blocs: [ mongoose.Schema.Types.Mixed ],
    forwardNotes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'notes' } ], 
    backwardNotes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'notes' } ], 
    isBookmarked: Boolean,
    isPrivate: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true }
});

const Note = mongoose.model("notes", notesSchema);

module.exports = Note