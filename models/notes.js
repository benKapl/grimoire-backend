const mongoose = require("mongoose")

const notesSchema = mongoose.Schema({
    title: String,
    blocs: [ mongoose.Schema.Types.Mixed ],
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