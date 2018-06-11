"user strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const presentationSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  options: { type: Object, required: false },
  title: { type: String, required: true },
  description: { type: String, required: false },
  slides: { type: Array, required: false },
  userId: { type: String, required: true }
}, { versionKey: false, collection: "PresentationModel" });

module.exports = mongoose.model('PresentationModel', presentationSchema);