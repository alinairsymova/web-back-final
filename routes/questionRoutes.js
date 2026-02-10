const express = require('express');
const router = express.Router();
const { updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;
