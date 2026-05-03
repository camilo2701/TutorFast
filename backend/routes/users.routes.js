const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');

router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getUserProfile);
router.post('/login', UsersController.loginUser);
router.post('/', UsersController.createUser);

module.exports = router;