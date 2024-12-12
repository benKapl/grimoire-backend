const mongoose = require("mongoose")

const notesSchema = mongoose.Schema({
    title: String,
    blocs: [ { type: mongoose.Schema.Types.ObjectId, ref: 'blocs' } ],
    forwardNotes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'notes' } ], 
    backwardNotes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'notes' } ], 
    isBookmarked: Boolean,
    isPrivate: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true }
}, {
    timestamps: true //creation automatique par mongoose de createdAt et updatedAt: 
});

const Note = mongoose.model("notes", notesSchema);

module.exports = Note