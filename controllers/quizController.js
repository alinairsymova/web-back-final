const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (user can create their own quiz)
exports.createQuiz = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
exports.getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ isPublic: true })
      .populate('createdBy', 'username')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get questions count (without revealing correct answers)
    const questionsCount = await Question.countDocuments({ quiz: quiz._id });

    res.status(200).json({
      success: true,
      data: {
        ...quiz.toObject(),
        questionsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (admin or quiz creator)
exports.updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

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
        message: 'Not authorized to update this quiz'
      });
    }

    const { title, description, isPublic } = req.body;

    quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, isPublic },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (admin or quiz creator)
exports.deleteQuiz = async (req, res, next) => {
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
        message: 'Not authorized to delete this quiz'
      });
    }

    // Delete all questions associated with this quiz
    await Question.deleteMany({ quiz: quiz._id });

    // Delete the quiz
    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz and associated questions deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
