const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// @desc    Add question to quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private (quiz creator or admin)
exports.addQuestion = async (req, res, next) => {
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
        message: 'Not authorized to add questions to this quiz'
      });
    }

    const { questionText, options, correctAnswer } = req.body;

    const question = await Question.create({
      quiz: req.params.id,
      questionText,
      options,
      correctAnswer
    });

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: question
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all questions for a quiz
// @route   GET /api/quizzes/:id/questions
// @access  Public (but correct answers are hidden for non-creators)
exports.getQuestions = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const questions = await Question.find({ quiz: req.params.id });

    // Hide correct answers unless user is quiz creator or admin
    const isCreatorOrAdmin = req.user && 
      (quiz.createdBy.toString() === req.user._id.toString() || req.user.role === 'admin');

    const questionsData = questions.map(q => {
      const questionObj = q.toObject();
      if (!isCreatorOrAdmin) {
        delete questionObj.correctAnswer;
      }
      return questionObj;
    });

    res.status(200).json({
      success: true,
      count: questionsData.length,
      data: questionsData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private (quiz creator or admin)
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const quiz = await Quiz.findById(question.quiz);

    // Check if user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question'
      });
    }

    const { questionText, options, correctAnswer } = req.body;

    question = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, options, correctAnswer },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private (quiz creator or admin)
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const quiz = await Quiz.findById(question.quiz);

    // Check if user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
