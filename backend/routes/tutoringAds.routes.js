const express = require('express');
const router = express.Router();

const TutoringAdsController = require('../controllers/tutoringAds.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/', TutoringAdsController.getAllTutoringAds);
router.get('/featured', TutoringAdsController.getFeaturedTutors);

router.post('/', verifyToken, TutoringAdsController.createTutoringAd);
router.post('/confirm', verifyToken, TutoringAdsController.createTutoria); 

router.get('/:id/booked', verifyToken, TutoringAdsController.checkUserBookedAd);
router.post('/:id/reviews', verifyToken, TutoringAdsController.createReview);
router.delete('/:id', verifyToken, TutoringAdsController.deleteTutoringAd);

router.get('/:id', TutoringAdsController.getTutoringAdById);

module.exports = router;