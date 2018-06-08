"user strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema({
 //   _id:Schema.Types.ObjectId,
    date: {type: Date},
    content: {type: String},
    username: {type: String}
}, {
    versionKey: false,
    collection: "MessageCollection"
});

module.exports = mongoose.model('MessageModel', MessageSchema);