const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contentTypes = require("../../Utilites/content_types")
const approvalTypes = require("../../Utilites/approval_types")

const contentSchema = new Schema({
  user_id:
  {
    type: String,
    unique: false,
    required: true, 
  },
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
    required: true,
  },
  content_type: 
  {
    type: String, // ["SCRIPT", "ARTICLE"]
    enum: [contentTypes.ARTICLE , contentTypes.SCRIPT],
    default: contentTypes.SCRIPT,
  },
  views: 
  {
    type: Number, 
    required: false
  },
  date: 
  {
    type: Date, 
    required: false
  },
  approvals:
  {
    type: String,
    required: true ,
    enum: [approvalTypes.PENDING , approvalTypes.REJECTED , approvalTypes.ACCEPTED],
    default: approvalTypes.PENDING,
  },
  movie:
  {
    required: false,
    type: String,
  },
  SEO:
  {
    required: false,
    type: Object,
  }
});

module.exports = mongoose.model('Content', contentSchema);