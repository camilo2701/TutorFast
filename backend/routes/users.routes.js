const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const verifyToken = require('../middleware/auth.middleware');

const UsersController = require('../controllers/users.controller');

router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getUserProfile);
router.post('/login', UsersController.loginUser);
router.post('/', upload.single('pfp'), UsersController.createUser);
router.patch(
  '/subscription',
  verifyToken,
  UsersController.activateSubscription
);

module.exports = router;