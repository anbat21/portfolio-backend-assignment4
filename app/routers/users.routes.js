var express = require('express');
var ctrl = require('../controllers/users.controller');
var auth = require('../middlewares/auth.middleware');
var router = express.Router();

// Public routes
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Sign up (create user) - public
router.post('/', ctrl.createOne);

// Sign in - public
router.post('/signin', ctrl.signIn);

// Protected routes (edit/delete user)
router.put('/:id', auth, ctrl.updateById);
router.delete('/:id', auth, ctrl.deleteById);
router.delete('/', auth, ctrl.deleteAll);

module.exports = router;
