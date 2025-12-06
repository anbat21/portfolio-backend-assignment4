var createError = require('http-errors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Model = require('../models/user.model');

// GET /api/users
exports.getAll = function(req, res, next){
  Model.find().select('-password').then(function(docs){
    res.json(docs);
  }).catch(next);
};

// GET /api/users/:id
exports.getById = function(req, res, next){
  Model.findById(req.params.id).select('-password').then(function(doc){
    if(!doc) return next(createError(404, 'User not found'));
    res.json(doc);
  }).catch(next);
};

// POST /api/users  -> Sign up (create user)
exports.createOne = function(req, res, next){
  // Basic validation
  if (!req.body.email || !req.body.password) {
    return next(createError(400, 'Email and password are required'));
  }

  Model.findOne({ email: req.body.email }).then(function(existing){
    if (existing) {
      throw createError(400, 'Email already in use');
    }
    return Model.create(req.body);
  }).then(function(doc){
    var userObj = doc.toObject();
    delete userObj.password;
    res.status(201).json(userObj);
  }).catch(next);
};

// PUT /api/users/:id  -> update user (protected via middleware in router)
exports.updateById = function(req, res, next){
  Model.findById(req.params.id).then(function(user){
    if (!user) throw createError(404, 'User not found');

    // Update allowed fields
    if (typeof req.body.firstname !== 'undefined') user.firstname = req.body.firstname;
    if (typeof req.body.lastname !== 'undefined') user.lastname = req.body.lastname;
    if (typeof req.body.email !== 'undefined') user.email = req.body.email;
    if (typeof req.body.password !== 'undefined' && req.body.password) {
      user.password = req.body.password; // will be re-hashed by pre('save')
    }

    return user.save();
  }).then(function(saved){
    var userObj = saved.toObject();
    delete userObj.password;
    res.json(userObj);
  }).catch(next);
};

// DELETE /api/users/:id  -> delete a single user (protected via middleware in router)
exports.deleteById = function(req, res, next){
  Model.findByIdAndDelete(req.params.id).then(function(doc){
    if(!doc) return next(createError(404, 'User not found'));
    res.status(204).end();
  }).catch(next);
};

// DELETE /api/users  -> delete all users (protected via middleware in router)
exports.deleteAll = function(req, res, next){
  Model.deleteMany().then(function(){
    res.status(204).end();
  }).catch(next);
};

// POST /api/users/signin  -> authenticate and return JWT token
exports.signIn = function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return next(createError(400, 'Email and password are required'));
  }

  Model.findOne({ email: email }).then(function(user){
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }
    return bcrypt.compare(password, user.password).then(function(isMatch){
      if (!isMatch) {
        throw createError(401, 'Invalid email or password');
      }

      var payload = { id: user._id, email: user.email };
      var token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret_jwt_key_change_me', {
        expiresIn: '1h'
      });

      var userObj = user.toObject();
      delete userObj.password;

      res.json({
        message: 'Sign in successful',
        token: token,
        user: userObj
      });
    });
  }).catch(next);
};
