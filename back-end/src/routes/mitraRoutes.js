require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('./middleware/verifyCredentials');

const profileMitraController = require('../controllers/mitraController');

// Mitra Profile Routes
router.get('/mitra/:mitraId', profileMitraController.getMitraProfile);
router.get(
  '/user_mitra/:userId',
  profileMitraController.getMitraProfileWithUserId
);
router.post(
  '/mitra/:mitraId',
  verifyToken,
  profileMitraController.updateProfileMitra
);
/* ===================================================================================*/

module.exports = router;
