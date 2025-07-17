import LegalAidProvider from '../models/LegalAidProvider.js';

// Get all legal aid providers
export const getAllProviders = async (req, res) => {
  try {
    const { page = 1, limit = 20, county, type } = req.query;

    const query = {};
    if (county) query['location.county'] = new RegExp(county, 'i');
    if (type) query.type = type;

    const providers = await LegalAidProvider.find(query)
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await LegalAidProvider.countDocuments(query);

    res.json({
      success: true,
      data: {
        providers,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_providers: total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving legal aid providers'
    });
  }
};

// Get specific provider by ID
export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await LegalAidProvider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Legal aid provider not found'
      });
    }

    res.json({
      success: true,
      data: { provider }
    });

  } catch (error) {
    console.error('Get provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving legal aid provider'
    });
  }
};

// Search providers
export const searchProviders = async (req, res) => {
  try {
    const { q: query, county, type, focusArea, mombasaOnly } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const filters = {
      county,
      type,
      focusArea,
      mombasaOnly: mombasaOnly === 'true'
    };

    const providers = await LegalAidProvider.searchProviders(query.trim(), filters);

    res.json({
      success: true,
      data: {
        query,
        filters,
        providers,
        total_results: providers.length
      }
    });

  } catch (error) {
    console.error('Search providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching legal aid providers'
    });
  }
};

// Get Mombasa-based providers
export const getMombasaProviders = async (req, res) => {
  try {
    const { focusArea, type } = req.query;

    let query = { is_mombasa_based: true };
    
    if (focusArea) {
      query.focus_areas = focusArea;
    }
    
    if (type) {
      query.type = type;
    }

    const providers = await LegalAidProvider.find(query)
      .sort({ name: 1 });

    res.json({
      success: true,
      data: {
        providers,
        total_providers: providers.length,
        location: 'Mombasa County'
      }
    });

  } catch (error) {
    console.error('Get Mombasa providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving Mombasa legal aid providers'
    });
  }
};

// Get providers by type
export const getProvidersByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { county } = req.query;

    let query = { type };
    if (county) {
      query['location.county'] = new RegExp(county, 'i');
    }

    const providers = await LegalAidProvider.find(query)
      .sort({ name: 1 });

    res.json({
      success: true,
      data: {
        type,
        providers,
        total_providers: providers.length
      }
    });

  } catch (error) {
    console.error('Get providers by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving providers by type'
    });
  }
};

// Get providers by focus area
export const getProvidersByFocusArea = async (req, res) => {
  try {
    const { focusArea } = req.params;
    const { county, mombasaOnly } = req.query;

    let query = { focus_areas: focusArea };
    
    if (county) {
      query['location.county'] = new RegExp(county, 'i');
    }
    
    if (mombasaOnly === 'true') {
      query.is_mombasa_based = true;
    }

    const providers = await LegalAidProvider.find(query)
      .sort({ name: 1 });

    res.json({
      success: true,
      data: {
        focus_area: focusArea,
        providers,
        total_providers: providers.length
      }
    });

  } catch (error) {
    console.error('Get providers by focus area error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving providers by focus area'
    });
  }
};

// Get emergency legal contacts
export const getEmergencyContacts = async (req, res) => {
  try {
    const emergencyProviders = await LegalAidProvider.find({
      'emergency_contact.available': true
    })
    .select('name contact_info emergency_contact location.county type')
    .sort({ name: 1 });

    // Add standard emergency contacts
    const standardEmergencyContacts = [
      {
        name: 'Police Emergency',
        phone: '999 / 112',
        description: 'For immediate police assistance',
        type: 'emergency-service'
      },
      {
        name: 'National Legal Aid Service (NLAS) Hotline',
        phone: '0800-720-440',
        description: 'Free legal aid hotline',
        type: 'legal-aid-hotline'
      },
      {
        name: 'Gender-Based Violence Hotline',
        phone: '1195',
        description: 'For gender-based violence emergencies',
        type: 'specialized-hotline'
      }
    ];

    res.json({
      success: true,
      data: {
        emergency_providers: emergencyProviders,
        standard_emergency_contacts: standardEmergencyContacts,
        total_emergency_providers: emergencyProviders.length
      }
    });

  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving emergency contacts'
    });
  }
};