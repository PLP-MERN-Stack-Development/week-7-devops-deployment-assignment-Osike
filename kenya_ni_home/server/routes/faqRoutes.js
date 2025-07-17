import express from 'express';
import {
  getAllFAQs,
  getFAQById,
  searchFAQs,
  getFAQsByCategory,
  getPopularFAQs,
  voteFAQHelpful,
  voteFAQNotHelpful
} from '../controllers/faqController.js';

const router = express.Router();

// GET /api/faqs - Get all FAQs
router.get('/', getAllFAQs);

// GET /api/faqs/:id - Get specific FAQ
router.get('/:id', getFAQById);

// GET /api/faqs/search - Search FAQs
router.get('/search', searchFAQs);

// GET /api/faqs/category/:category - Get FAQs by category
router.get('/category/:category', getFAQsByCategory);

// GET /api/faqs/popular - Get popular FAQs
router.get('/popular', getPopularFAQs);

// POST /api/faqs/:id/helpful - Vote FAQ as helpful
router.post('/:id/helpful', voteFAQHelpful);

// POST /api/faqs/:id/not-helpful - Vote FAQ as not helpful
router.post('/:id/not-helpful', voteFAQNotHelpful);

export default router;