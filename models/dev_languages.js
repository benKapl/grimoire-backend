const mongoose = require("mongoose")

const devLangsSchema = mongoose.Schema({
    displayValue: String,
    editorValue: String,
    apiValue: String,
    isExecutable: Boolean,
});

const DevLang = mongoose.model("dev_languages", devLangsSchema);

module.exports = DevLang