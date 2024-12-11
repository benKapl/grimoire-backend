const mongoose = require("mongoose")

const blocsSchema = mongoose.Schema({
    type: String,
    content: String,
    createdAt: { type: Date, index: true },
    updatedAt: { type: Date, index: true },
    language: { type: mongoose.Schema.Types.ObjectId, ref: 'dev_languages' }
});

const Bloc = mongoose.model("blocs", blocsSchema);

module.exports = Bloc