import express from 'express';
import { 
  sendMessage, 
  getSessionHistory, 
  endSession,
  getSuggestions,
  rateSatisfaction
} from '../controllers/chatController.js';
import { validateChatMessage } from '../middleware/validation.js';
import { chatRateLimit } from '../middleware/rateLimiting.js';

const router = express.Router();

// POST /api/chat/message - Send a message to the chatbot
router.post('/message', chatRateLimit, validateChatMessage, sendMessage);

// GET /api/chat/session/:sessionId - Get chat session history
router.get('/session/:sessionId', getSessionHistory);

// POST /api/chat/session/:sessionId/end - End a chat session
router.post('/session/:sessionId/end', endSession);

// GET /api/chat/suggestions - Get conversation suggestions
router.get('/suggestions', getSuggestions);

// POST /api/chat/session/:sessionId/rate - Rate session satisfaction
router.post('/session/:sessionId/rate', rateSatisfaction);

export default router;