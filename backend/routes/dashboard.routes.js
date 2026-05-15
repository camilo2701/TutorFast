const express = require('express');
const multer = require('multer');

const DashboardController = require('../controllers/dashboard.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', verifyToken, DashboardController.getMe);
router.patch('/me', verifyToken, upload.single('pfp'), DashboardController.updateMe);

router.get('/reviews', verifyToken, DashboardController.getReviews);
router.delete('/reviews/:id', verifyToken, DashboardController.deleteReview);

router.get('/bookings', verifyToken, DashboardController.getBookings);
router.get('/ads', verifyToken, DashboardController.getAds);

router.get('/users', verifyToken, DashboardController.getUsers);
router.patch('/users/:id', verifyToken, DashboardController.updateUser);
router.delete('/users/:id', verifyToken, DashboardController.deleteUser);
router.patch('/users/:id/delete-image', verifyToken, DashboardController.deleteUserImage);

module.exports = router;