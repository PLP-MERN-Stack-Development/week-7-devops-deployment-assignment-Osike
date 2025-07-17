import FAQ from '../models/FAQ.js';

// Get all FAQs
export const getAllFAQs = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;

    const query = { is_active: true };
    if (category) query.category = category;

    const faqs = await FAQ.find(query)
      .populate('related_articles', 'article_number title')
      .populate('related_topics', 'title category')
      .sort({ priority: -1, view_count: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await FAQ.countDocuments(query);

    res.json({
      success: true,
      data: {
        faqs,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_faqs: total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving FAQs'
    });
  }
};

// Get specific FAQ by ID
export const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id)
      .populate('related_articles', 'article_number title summary')
      .populate('related_topics', 'title category summary');

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Increment view count
    await faq.incrementViewCount();

    res.json({
      success: true,
      data: { faq }
    });

  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving FAQ'
    });
  }
};

// Search FAQs
export const searchFAQs = async (req, res) => {
  try {
    const { q: query, category } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const faqs = await FAQ.searchFAQs(query.trim(), category);

    res.json({
      success: true,
      data: {
        query,
        category,
        faqs,
        total_results: faqs.length
      }
    });

  } catch (error) {
    console.error('Search FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching FAQs'
    });
  }
};

// Get FAQs by category
export const getFAQsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const faqs = await FAQ.getFAQsByCategory(category);

    res.json({
      success: true,
      data: {
        category,
        faqs,
        total_faqs: faqs.length
      }
    });

  } catch (error) {
    console.error('Get FAQs by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving FAQs by category'
    });
  }
};

// Get popular FAQs
export const getPopularFAQs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const faqs = await FAQ.getPopularFAQs(parseInt(limit));

    res.json({
      success: true,
      data: {
        faqs,
        total_faqs: faqs.length
      }
    });

  } catch (error) {
    console.error('Get popular FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving popular FAQs'
    });
  }
};

// Vote FAQ as helpful
export const voteFAQHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.voteHelpful();

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      data: {
        helpful_votes: faq.helpful_votes,
        helpfulness_ratio: faq.helpfulness_ratio
      }
    });

  } catch (error) {
    console.error('Vote helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording vote'
    });
  }
};

// Vote FAQ as not helpful
export const voteFAQNotHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.voteNotHelpful();

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      data: {
        not_helpful_votes: faq.not_helpful_votes,
        helpfulness_ratio: faq.helpfulness_ratio
      }
    });

  } catch (error) {
    console.error('Vote not helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording vote'
    });
  }
};