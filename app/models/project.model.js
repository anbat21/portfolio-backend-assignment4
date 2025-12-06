var mongoose = require('mongoose');
var schema = new mongoose.Schema({
  title: { type: String, required: true },
  completion: { type: Date, required: true },
  description: { type: String, required: true }
},{ timestamps: false });
module.exports = mongoose.model('projects', schema);
