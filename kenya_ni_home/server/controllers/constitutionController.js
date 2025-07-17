import ConstitutionArticle from '../models/ConstitutionArticle.js';

// Get all constitution chapters
export const getAllChapters = async (req, res) => {
  try {
    const chapters = await ConstitutionArticle.aggregate([
      {
        $group: {
          _id: '$chapter_number',
          chapter_title: { $first: '$chapter_title' },
          article_count: { $sum: 1 },
          articles: {
            $push: {
              article_number: '$article_number',
              title: '$title'
            }
          }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          chapter_number: '$_id',
          chapter_title: 1,
          article_count: 1,
          articles: { $slice: ['$articles', 5] }, // Show first 5 articles
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: { chapters }
    });

  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving chapters'
    });
  }
};

// Get articles by chapter
export const getChapterArticles = async (req, res) => {
  try {
    const { chapterNumber } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const articles = await ConstitutionArticle.find({ 
      chapter_number: parseInt(chapterNumber) 
    })
    .select('article_number title summary keywords is_bill_of_rights_article')
    .sort({ article_number: 1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ConstitutionArticle.countDocuments({ 
      chapter_number: parseInt(chapterNumber) 
    });

    const chapterInfo = await ConstitutionArticle.findOne({ 
      chapter_number: parseInt(chapterNumber) 
    }).select('chapter_title chapter_number');

    res.json({
      success: true,
      data: {
        chapter: chapterInfo,
        articles,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_articles: total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get chapter articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving chapter articles'
    });
  }
};

// Get specific article by ID
export const getArticleById = async (req, res) => {
  try {
    const { articleNumber } = req.params;

    const article = await ConstitutionArticle.findOne({ 
      article_number: parseInt(articleNumber) 
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Get related articles
    const relatedArticles = await article.getRelatedArticles();

    res.json({
      success: true,
      data: {
        article,
        related_articles: relatedArticles
      }
    });

  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving article'
    });
  }
};

// Search constitution
export const searchConstitution = async (req, res) => {
  try {
    const { q: query, chapter, billOfRightsOnly, limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const options = {
      limit: parseInt(limit),
      billOfRightsOnly: billOfRightsOnly === 'true',
      chapter: chapter ? parseInt(chapter) : null
    };

    const articles = await ConstitutionArticle.searchArticles(query.trim(), options);

    res.json({
      success: true,
      data: {
        query,
        results: articles,
        total_results: articles.length
      }
    });

  } catch (error) {
    console.error('Search constitution error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching constitution'
    });
  }
};

// Get Bill of Rights articles
export const getBillOfRights = async (req, res) => {
  try {
    const { detailed = false } = req.query;

    const selectFields = detailed 
      ? '' // Select all fields
      : 'article_number title summary keywords practical_examples';

    const articles = await ConstitutionArticle.findBillOfRightsArticles()
      .select(selectFields);

    const chapterInfo = await ConstitutionArticle.findOne({ 
      chapter_number: 4 
    }).select('chapter_title chapter_number');

    res.json({
      success: true,
      data: {
        chapter: chapterInfo,
        articles,
        total_articles: articles.length
      }
    });

  } catch (error) {
    console.error('Get Bill of Rights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving Bill of Rights'
    });
  }
};

// Get articles by keyword
export const getArticlesByKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;
    const { limit = 10 } = req.query;

    const articles = await ConstitutionArticle.find({
      keywords: { $in: [new RegExp(keyword, 'i')] }
    })
    .select('article_number title summary keywords is_bill_of_rights_article')
    .sort({ article_number: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        keyword,
        articles,
        total_results: articles.length
      }
    });

  } catch (error) {
    console.error('Get articles by keyword error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving articles by keyword'
    });
  }
};

// Get related articles
export const getRelatedArticles = async (req, res) => {
  try {
    const { articleNumber } = req.params;

    const article = await ConstitutionArticle.findOne({ 
      article_number: parseInt(articleNumber) 
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const relatedArticles = await article.getRelatedArticles();

    res.json({
      success: true,
      data: {
        article_number: parseInt(articleNumber),
        related_articles: relatedArticles
      }
    });

  } catch (error) {
    console.error('Get related articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving related articles'
    });
  }
};