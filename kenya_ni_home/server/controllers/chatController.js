import ChatSession from '../models/ChatSession.js';
import ConstitutionArticle from '../models/ConstitutionArticle.js';
import LegalTopic from '../models/LegalTopic.js';
import FAQ from '../models/FAQ.js';
import { generateChatResponse } from '../services/chatbotService.js';
import { v4 as uuidv4 } from 'uuid';

// Send message to chatbot
export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;

    // Generate session ID if not provided
    const currentSessionId = sessionId || uuidv4();

    // Find or create chat session
    let session = await ChatSession.findOne({ session_id: currentSessionId });
    
    if (!session) {
      session = new ChatSession({
        session_id: currentSessionId,
        session_metadata: {
          user_agent: userAgent,
          ip_address: ipAddress,
          device_type: getDeviceType(userAgent)
        }
      });
    }

    // Add user message
    await session.addMessage('user', message);

    // Generate bot response
    const startTime = Date.now();
    const botResponse = await generateChatResponse(message, session);
    const processingTime = Date.now() - startTime;

    // Add bot message with metadata
    await session.addMessage('bot', botResponse.text, 'text', {
      confidence_score: botResponse.confidence,
      matched_topics: botResponse.matchedTopics,
      referenced_articles: botResponse.referencedArticles,
      processing_time: processingTime
    });

    res.json({
      success: true,
      data: {
        sessionId: currentSessionId,
        response: botResponse.text,
        confidence: botResponse.confidence,
        suggestions: botResponse.suggestions,
        referencedArticles: botResponse.referencedArticles,
        processingTime
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get session history
export const getSessionHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const session = await ChatSession.findOne({ session_id: sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Get recent messages
    const messages = session.messages
      .slice(-parseInt(limit))
      .map(msg => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
        type: msg.message_type
      }));

    res.json({
      success: true,
      data: {
        sessionId,
        messages,
        totalMessages: session.total_messages,
        startedAt: session.started_at,
        lastActivity: session.last_activity
      }
    });

  } catch (error) {
    console.error('Session history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving session history'
    });
  }
};

// End chat session
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { rating, feedback } = req.body;

    const session = await ChatSession.findOne({ session_id: sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await session.endSession(rating, feedback);

    res.json({
      success: true,
      message: 'Session ended successfully',
      data: {
        sessionId,
        duration: session.duration_minutes,
        totalMessages: session.total_messages
      }
    });

  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending session'
    });
  }
};

// Get conversation suggestions
export const getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "What are my rights under the Constitution?",
      "How do I report a crime in Mombasa?",
      "What should I do if my landlord wants to evict me?",
      "How can I file a case in Small Claims Court?",
      "Where can I get free legal help in Mombasa?",
      "What is Article 27 about equality?",
      "What are my rights if I'm arrested?",
      "How do I access the Bill of Rights?"
    ];

    res.json({
      success: true,
      data: { suggestions }
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting suggestions'
    });
  }
};

// Rate session satisfaction
export const rateSatisfaction = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const session = await ChatSession.findOne({ session_id: sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    session.satisfaction_rating = {
      rating,
      feedback,
      timestamp: new Date()
    };

    await session.save();

    res.json({
      success: true,
      message: 'Thank you for your feedback!'
    });

  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving rating'
    });
  }
};

// Helper function to determine device type
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};