const mongoose = require("mongoose")

const tagsSchema = mongoose.Schema({
    value: String,
    notes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'notes' } ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

const Tag = mongoose.model("tags", tagsSchema);

module.exports = Tag