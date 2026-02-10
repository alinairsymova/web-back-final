const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');
const { addQuestion, getQuestions } = require('../controllers/questionController');
const { submitQuiz, getQuizResults } = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

// Quiz routes
router.post('/', protect, createQuiz); // Any authenticated user can create a quiz
router.get('/', getAllQuizzes);
router.get('/:id', getQuiz);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);

// Question routes (nested under quiz)
router.post('/:id/questions', protect, addQuestion);
router.get('/:id/questions', protect, getQuestions);

// Submit quiz
router.post('/:id/submit', protect, submitQuiz);

// Get all results for a quiz (admin or quiz creator)
router.get('/:id/results', protect, getQuizResults);

module.exports = router;
