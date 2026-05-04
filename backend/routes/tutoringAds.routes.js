const express = require('express');
const router = express.Router();

const TutoringAdsController = require('../controllers/tutoringAds.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/', verifyToken, TutoringAdsController.createTutoringAd);
router.get('/:id', TutoringAdsController.getTutoringAdById);
router.post('/confirm', verifyToken, TutoringAdsController.createTutoria);

module.exports = router;