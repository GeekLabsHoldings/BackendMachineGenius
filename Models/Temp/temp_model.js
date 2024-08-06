const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contentTypes = require("../../Utilites/content_types")
const approvalTypes = require("../../Utilites/approval_types")

const tempSchema = new Schema({
  title: 
  {
    type: String,
    unique: true,
    required: false 
  },
  content: 
  {
    type: String,
    required: false 
  },
});

module.exports = mongoose.model('Temp', tempSchema);