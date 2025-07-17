import express from 'express';
import {
  getChatAnalytics,
  getPopularTopics,
  getPopularArticles,
  getUserEngagement,
  getSystemHealth
} from '../controllers/analyticsController.js';

const router = express.Router();

// GET /api/analytics/chat - Get chat analytics
router.get('/chat', getChatAnalytics);

// GET /api/analytics/topics - Get popular topics
router.get('/topics', getPopularTopics);

// GET /api/analytics/articles - Get popular constitution articles
router.get('/articles', getPopularArticles);

// GET /api/analytics/engagement - Get user engagement metrics
router.get('/engagement', getUserEngagement);

// GET /api/analytics/health - Get system health metrics
router.get('/health', getSystemHealth);

export default router;