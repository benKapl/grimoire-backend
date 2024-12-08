const mongoose = require("mongoose")

const devLangsSchema = mongoose.Schema({
    value: String,
});

const DevLang = mongoose.model("users", devLangsSchema);

module.exports = DevLang