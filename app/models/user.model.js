var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var schema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Before save: update timestamp and hash password if changed
schema.pre('save', function(next){
  this.updated = new Date();

  if (!this.isModified('password')) return next();

  var user = this;
  bcrypt.genSalt(10, function(err, salt){
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash){
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Helper method to compare passwords (can be used in controllers)
schema.methods.comparePassword = function(candidatePassword){
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('users', schema);
