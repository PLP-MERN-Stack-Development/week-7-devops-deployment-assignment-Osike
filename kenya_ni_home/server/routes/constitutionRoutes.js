import express from 'express';
import {
  getAllChapters,
  getChapterArticles,
  getArticleById,
  searchConstitution,
  getBillOfRights,
  getArticlesByKeyword,
  getRelatedArticles
} from '../controllers/constitutionController.js';

const router = express.Router();

// GET /api/constitution/chapters - Get all constitution chapters
router.get('/chapters', getAllChapters);

// GET /api/constitution/articles/:chapterNumber - Get articles by chapter
router.get('/articles/:chapterNumber', getChapterArticles);

// GET /api/constitution/article/:articleNumber - Get specific article
router.get('/article/:articleNumber', getArticleById);

// GET /api/constitution/search - Search constitution text
router.get('/search', searchConstitution);

// GET /api/constitution/bill-of-rights - Get all Bill of Rights articles
router.get('/bill-of-rights', getBillOfRights);

// GET /api/constitution/keywords/:keyword - Get articles by keyword
router.get('/keywords/:keyword', getArticlesByKeyword);

// GET /api/constitution/article/:articleNumber/related - Get related articles
router.get('/article/:articleNumber/related', getRelatedArticles);

export default router;