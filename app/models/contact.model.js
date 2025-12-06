var mongoose = require('mongoose');
var schema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true }
},{ timestamps: false });
module.exports = mongoose.model('contacts', schema);
