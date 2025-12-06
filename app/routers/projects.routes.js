var express = require('express');
var ctrl = require('../controllers/projects.controller');
var auth = require('../middlewares/auth.middleware');
var router = express.Router();

// Public: list and get by id
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Protected: create, update, delete
router.post('/', auth, ctrl.createOne);
router.put('/:id', auth, ctrl.updateById);
router.delete('/:id', auth, ctrl.deleteById);
router.delete('/', auth, ctrl.deleteAll);

module.exports = router;
