const express = require('express');
const router = express.Router();

const TutoringAdsController = require('../controllers/tutoringAds.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/', verifyToken, TutoringAdsController.createTutoringAd);

module.exports = router;