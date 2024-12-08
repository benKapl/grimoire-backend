const mongoose = require("mongoose")

const usersSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    token: String,
    profilePic: String, 
    isDark: Boolean,
    devLang: { type: mongoose.Schema.Types.ObjectId, ref: 'dev_languages' },
});

const User = mongoose.model("user", usersSchema);

module.exports = User