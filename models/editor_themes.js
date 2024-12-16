const mongoose = require("mongoose")

const editorThemesSchema = mongoose.Schema({
    displayValue: String,
    editorValue: String,
});

const EditorTheme = mongoose.model("editor_themes", editorThemesSchema);

module.exports = EditorTheme