const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const UsersController = require('../controllers/users.controller');

router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getUserProfile);
router.post('/login', UsersController.loginUser);
router.post('/', upload.single('pfp'), UsersController.createUser);

module.exports = router;