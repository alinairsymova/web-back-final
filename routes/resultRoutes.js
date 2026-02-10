const express = require('express');
const router = express.Router();
const { getMyResults, getResult } = require('../controllers/resultController');
const { protect } = require('../middleware/auth');

router.get('/my', protect, getMyResults);
router.get('/:id', protect, getResult);

module.exports = router;
