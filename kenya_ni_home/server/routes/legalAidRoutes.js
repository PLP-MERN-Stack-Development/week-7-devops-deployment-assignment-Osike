import express from 'express';
import {
  getAllProviders,
  getProviderById,
  searchProviders,
  getMombasaProviders,
  getProvidersByType,
  getProvidersByFocusArea,
  getEmergencyContacts
} from '../controllers/legalAidController.js';

const router = express.Router();

// GET /api/legal-aid/providers - Get all legal aid providers
router.get('/providers', getAllProviders);

// GET /api/legal-aid/providers/:id - Get specific provider
router.get('/providers/:id', getProviderById);

// GET /api/legal-aid/search - Search providers
router.get('/search', searchProviders);

// GET /api/legal-aid/mombasa - Get Mombasa-based providers
router.get('/mombasa', getMombasaProviders);

// GET /api/legal-aid/type/:type - Get providers by type
router.get('/type/:type', getProvidersByType);

// GET /api/legal-aid/focus/:focusArea - Get providers by focus area
router.get('/focus/:focusArea', getProvidersByFocusArea);

// GET /api/legal-aid/emergency - Get emergency legal contacts
router.get('/emergency', getEmergencyContacts);

export default router;