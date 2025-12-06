var createError = require('http-errors');
var Model = require('../models/contact.model');

exports.getAll = function(req, res, next){
  Model.find().then(function(docs){
    res.json(docs);
  }).catch(next);
};

exports.getById = function(req, res, next){
  Model.findById(req.params.id).then(function(doc){
    if(!doc) return next(createError(404, 'Contact not found'));
    res.json(doc);
  }).catch(next);
};

exports.createOne = function(req, res, next){
  Model.create(req.body).then(function(doc){
    res.status(201).json(doc);
  }).catch(next);
};

exports.updateById = function(req, res, next){
  Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .then(function(doc){
      if(!doc) return next(createError(404, 'Contact not found'));
      res.json(doc);
    })
    .catch(next);
};

exports.deleteById = function(req, res, next){
  Model.findByIdAndDelete(req.params.id).then(function(doc){
    if(!doc) return next(createError(404, 'Contact not found'));
    res.status(204).end();
  }).catch(next);
};

exports.deleteAll = function(req, res, next){
  Model.deleteMany().then(function(){
    res.status(204).end();
  }).catch(next);
};
