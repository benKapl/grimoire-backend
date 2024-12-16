const mongoose = require("mongoose")

const usersSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    token: String,
    profilePic: String, 
    defaultDevLang: { type: mongoose.Schema.Types.ObjectId, ref: 'dev_languages' } || null,
    isDark: Boolean,
});

const User = mongoose.model("user", usersSchema);

module.exports = User