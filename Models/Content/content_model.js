const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contentTypes = require("../../Utilites/content_types")
// const validator  = require('validator');
// Create User schema
const contentSchema = new Schema({
  content_title: 
  {
    type: String,
    unique: true,
    required: true 
  },
  content: 
  {
    type: String,
    required: true 
  },
  brand: 
  {
    type: String,
    required: false,
  },
  content_type: 
  {
    type: String, // ["SCRIPT", "ARTICLE"]
    enum: [contentTypes.ARTICLE , contentTypes.SCRIPT],
    default: contentTypes.SCRIPT
  },
  movie:
  {
    required: false,
    type: String,
    // default: "uploads/test.mp4"
  }
});

module.exports = mongoose.model('Content', contentSchema);