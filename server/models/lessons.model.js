"user strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: false },
  userId: { type: String, required: true },
  lesson: { type: String, required: true },
  users: { type: Array, required: true }
}, { versionKey: false, collection: "LessonsModel" });

module.exports = mongoose.model('LessonsModel', LessonSchema);