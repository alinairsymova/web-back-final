const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @desc    Submit quiz answers and calculate score
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const { answers } = req.body; // answers should be array of { questionId, selectedAnswer }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers in correct format'
      });
    }

    // Check if user already submitted this quiz
    const existingResult = await Result.findOne({
      user: req.user._id,
      quiz: req.params.id
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this quiz'
      });
    }

    // Get all questions for the quiz
    const questions = await Question.find({ quiz: req.params.id });

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This quiz has no questions'
      });
    }

    // Calculate score
    let score = 0;
    const detailedAnswers = [];

    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) {
          score++;
        }

        detailedAnswers.push({
          question: question._id,
          selectedAnswer: answer.selectedAnswer,
          isCorrect
        });
      }
    }

    // Create result
    const result = await Result.create({
      user: req.user._id,
      quiz: req.params.id,
      score,
      totalQuestions: questions.length,
      answers: detailedAnswers
    });

    // Populate result with quiz and user details
    await result.populate('quiz', 'title description');
    await result.populate('user', 'username email');

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score,
        totalQuestions: questions.length,
        percentage: ((score / questions.length) * 100).toFixed(2),
        result
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's quiz results
// @route   GET /api/results/my
// @access  Private
exports.getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title description')
      .sort('-submittedAt');

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific result details
// @route   GET /api/results/:id
// @access  Private
exports.getResult = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quiz', 'title description')
      .populate('user', 'username email')
      .populate('answers.question');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Check if user owns this result or is admin
    if (result.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this result'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all results for a specific quiz (admin or quiz creator only)
// @route   GET /api/quizzes/:id/results
// @access  Private (admin or quiz creator)
exports.getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these results'
      });
    }

    const results = await Result.find({ quiz: req.params.id })
      .populate('user', 'username email')
      .sort('-score');

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};
