const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  movie:
  {
    required: true,
    type: String,
    default: "uploads/test.mp4"
  }
});

module.exports = mongoose.model('Movie', movieSchema);