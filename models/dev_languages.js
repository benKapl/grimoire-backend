const mongoose = require("mongoose")

const devLangsSchema = mongoose.Schema({
    value: String,
});

const DevLang = mongoose.model("dev_languages", devLangsSchema);

module.exports = DevLang