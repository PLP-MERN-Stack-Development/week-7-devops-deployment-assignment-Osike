// Validation middleware for chat messages
export const validateChatMessage = (req, res, next) => {
  const { message } = req.body;

  // Check if message exists
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }

  // Check message length
  if (typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Message must be a non-empty string'
    });
  }

  if (message.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Message must be less than 1000 characters'
    });
  }

  // Sanitize message (basic)
  req.body.message = message.trim();

  next();
};

// Validation for session rating
export const validateSessionRating = (req, res, next) => {
  const { rating, feedback } = req.body;

  if (!rating) {
    return res.status(400).json({
      success: false,
      message: 'Rating is required'
    });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be an integer between 1 and 5'
    });
  }

  if (feedback && typeof feedback !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Feedback must be a string'
    });
  }

  if (feedback && feedback.length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Feedback must be less than 500 characters'
    });
  }

  next();
};