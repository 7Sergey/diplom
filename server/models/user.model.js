"user strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    password: { type: String, required:true},
    username: { type: String, required:true, unique:true}
}, {
        versionKey: false,
        collection: "UserModel"
    });

module.exports = mongoose.model('UserModel', userSchema);