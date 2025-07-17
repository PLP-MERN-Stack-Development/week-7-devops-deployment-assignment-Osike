import ChatSession from '../models/ChatSession.js';
import ConstitutionArticle from '../models/ConstitutionArticle.js';
import LegalTopic from '../models/LegalTopic.js';
import FAQ from '../models/FAQ.js';

// Get chat analytics
export const getChatAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period = '7d' } = req.query;

    // Calculate date range
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - getPeriodMs(period));

    // Get session analytics
    const sessionAnalytics = await ChatSession.getSessionAnalytics(start, end);

    // Get daily session counts
    const dailySessions = await ChatSession.aggregate([
      {
        $match: {
          started_at: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$started_at' }
          },
          sessions: { $sum: 1 },
          total_messages: { $sum: '$total_messages' },
          avg_duration: { $avg: '$session_duration' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top topics discussed
    const topTopics = await ChatSession.aggregate([
      {
        $match: {
          started_at: { $gte: start, $lte: end }
        }
      },
      { $unwind: '$topics_discussed' },
      {
        $group: {
          _id: '$topics_discussed.topic',
          frequency: { $sum: '$topics_discussed.frequency' },
          sessions: { $addToSet: '$session_id' }
        }
      },
      {
        $project: {
          topic: '$_id',
          frequency: 1,
          unique_sessions: { $size: '$sessions' },
          _id: 0
        }
      },
      { $sort: { frequency: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        period: { start, end },
        overview: sessionAnalytics[0] || {},
        daily_sessions: dailySessions,
        top_topics: topTopics
      }
    });

  } catch (error) {
    console.error('Chat analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving chat analytics'
    });
  }
};

// Get popular topics
export const getPopularTopics = async (req, res) => {
  try {
    const { period = '30d', limit = 10 } = req.query;

    const startDate = new Date(Date.now() - getPeriodMs(period));

    const popularTopics = await ChatSession.aggregate([
      {
        $match: {
          started_at: { $gte: startDate }
        }
      },
      { $unwind: '$topics_discussed' },
      {
        $group: {
          _id: '$topics_discussed.topic',
          total_frequency: { $sum: '$topics_discussed.frequency' },
          unique_sessions: { $addToSet: '$session_id' },
          avg_frequency_per_session: { $avg: '$topics_discussed.frequency' }
        }
      },
      {
        $project: {
          topic: '$_id',
          total_frequency: 1,
          unique_sessions: { $size: '$unique_sessions' },
          avg_frequency_per_session: { $round: ['$avg_frequency_per_session', 2] },
          _id: 0
        }
      },
      { $sort: { total_frequency: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: {
        period,
        popular_topics: popularTopics
      }
    });

  } catch (error) {
    console.error('Popular topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving popular topics'
    });
  }
};

// Get popular constitution articles
export const getPopularArticles = async (req, res) => {
  try {
    const { period = '30d', limit = 10 } = req.query;

    const startDate = new Date(Date.now() - getPeriodMs(period));

    const popularArticles = await ChatSession.aggregate([
      {
        $match: {
          started_at: { $gte: startDate }
        }
      },
      { $unwind: '$articles_referenced' },
      {
        $group: {
          _id: '$articles_referenced.article_number',
          total_references: { $sum: '$articles_referenced.frequency' },
          unique_sessions: { $addToSet: '$session_id' }
        }
      },
      {
        $project: {
          article_number: '$_id',
          total_references: 1,
          unique_sessions: { $size: '$unique_sessions' },
          _id: 0
        }
      },
      { $sort: { total_references: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Get article details
    const articleNumbers = popularArticles.map(a => a.article_number);
    const articles = await ConstitutionArticle.find({
      article_number: { $in: articleNumbers }
    }).select('article_number title chapter_number is_bill_of_rights_article');

    // Merge analytics with article details
    const enrichedArticles = popularArticles.map(analytics => {
      const article = articles.find(a => a.article_number === analytics.article_number);
      return {
        ...analytics,
        article_details: article || null
      };
    });

    res.json({
      success: true,
      data: {
        period,
        popular_articles: enrichedArticles
      }
    });

  } catch (error) {
    console.error('Popular articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving popular articles'
    });
  }
};

// Get user engagement metrics
export const getUserEngagement = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    const startDate = new Date(Date.now() - getPeriodMs(period));

    // Get engagement metrics
    const engagement = await ChatSession.aggregate([
      {
        $match: {
          started_at: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total_sessions: { $sum: 1 },
          avg_session_duration: { $avg: '$session_duration' },
          avg_messages_per_session: { $avg: '$total_messages' },
          total_messages: { $sum: '$total_messages' },
          sessions_with_rating: {
            $sum: {
              $cond: [{ $ne: ['$satisfaction_rating.rating', null] }, 1, 0]
            }
          },
          avg_satisfaction: { $avg: '$satisfaction_rating.rating' },
          active_sessions: {
            $sum: {
              $cond: [{ $eq: ['$is_active', true] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get device type breakdown
    const deviceBreakdown = await ChatSession.aggregate([
      {
        $match: {
          started_at: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$session_metadata.device_type',
          count: { $sum: 1 },
          avg_duration: { $avg: '$session_duration' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        period,
        engagement_metrics: engagement[0] || {},
        device_breakdown: deviceBreakdown
      }
    });

  } catch (error) {
    console.error('User engagement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user engagement metrics'
    });
  }
};

// Get system health metrics
export const getSystemHealth = async (req, res) => {
  try {
    // Get database collection stats
    const constitutionCount = await ConstitutionArticle.countDocuments();
    const legalTopicsCount = await LegalTopic.countDocuments();
    const faqCount = await FAQ.countDocuments({ is_active: true });
    const activeSessions = await ChatSession.countDocuments({ is_active: true });

    // Get recent activity
    const recentActivity = await ChatSession.aggregate([
      {
        $match: {
          started_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d %H:00', date: '$started_at' }
          },
          sessions: { $sum: 1 },
          messages: { $sum: '$total_messages' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate uptime (simplified - in production, use proper monitoring)
    const uptime = process.uptime();

    res.json({
      success: true,
      data: {
        database_health: {
          constitution_articles: constitutionCount,
          legal_topics: legalTopicsCount,
          active_faqs: faqCount,
          active_sessions: activeSessions
        },
        system_health: {
          uptime_seconds: Math.floor(uptime),
          uptime_hours: Math.floor(uptime / 3600),
          memory_usage: process.memoryUsage(),
          node_version: process.version
        },
        recent_activity: recentActivity
      }
    });

  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving system health metrics'
    });
  }
};

// Helper function to convert period string to milliseconds
const getPeriodMs = (period) => {
  const periods = {
    '1d': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000
  };
  return periods[period] || periods['7d'];
};