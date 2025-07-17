import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  message_type: {
    type: String,
    enum: ['text', 'quick_reply', 'suggestion', 'error'],
    default: 'text'
  },
  metadata: {
    confidence_score: Number,
    matched_topics: [String],
    referenced_articles: [Number],
    processing_time: Number,
    user_location: String
  }
});

const chatSessionSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user_id: {
    type: String,
    default: null // Anonymous users
  },
  messages: [messageSchema],
  session_metadata: {
    user_agent: String,
    ip_address: String,
    location: {
      country: String,
      region: String,
      city: String
    },
    language_preference: {
      type: String,
      default: 'en'
    },
    device_type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown'
    }
  },
  topics_discussed: [{
    topic: String,
    frequency: {
      type: Number,
      default: 1
    }
  }],
  articles_referenced: [{
    article_number: Number,
    frequency: {
      type: Number,
      default: 1
    }
  }],
  satisfaction_rating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    timestamp: Date
  },
  is_active: {
    type: Boolean,
    default: true
  },
  started_at: {
    type: Date,
    default: Date.now
  },
  last_activity: {
    type: Date,
    default: Date.now
  },
  ended_at: Date,
  total_messages: {
    type: Number,
    default: 0
  },
  session_duration: Number // in seconds
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
chatSessionSchema.index({ session_id: 1 });
chatSessionSchema.index({ started_at: -1 });
chatSessionSchema.index({ is_active: 1, last_activity: -1 });
chatSessionSchema.index({ 'session_metadata.location.city': 1 });

// Virtual for session duration in minutes
chatSessionSchema.virtual('duration_minutes').get(function() {
  if (this.session_duration) {
    return Math.round(this.session_duration / 60);
  }
  const end = this.ended_at || this.last_activity;
  return Math.round((end - this.started_at) / (1000 * 60));
});

// Pre-save middleware to update counters and timestamps
chatSessionSchema.pre('save', function(next) {
  this.total_messages = this.messages.length;
  this.last_activity = Date.now();
  
  if (this.ended_at) {
    this.session_duration = Math.round((this.ended_at - this.started_at) / 1000);
  }
  
  next();
});

// Instance method to add message
chatSessionSchema.methods.addMessage = function(sender, content, messageType = 'text', metadata = {}) {
  const message = {
    sender,
    content,
    message_type: messageType,
    metadata,
    timestamp: new Date()
  };
  
  this.messages.push(message);
  this.last_activity = Date.now();
  
  return this.save();
};

// Instance method to end session
chatSessionSchema.methods.endSession = function(rating = null, feedback = null) {
  this.is_active = false;
  this.ended_at = Date.now();
  
  if (rating) {
    this.satisfaction_rating = {
      rating,
      feedback,
      timestamp: Date.now()
    };
  }
  
  return this.save();
};

// Static method to get active sessions
chatSessionSchema.statics.getActiveSessions = function() {
  return this.find({ is_active: true }).sort({ last_activity: -1 });
};

// Static method to get session analytics
chatSessionSchema.statics.getSessionAnalytics = function(startDate, endDate) {
  const matchStage = {
    started_at: {
      $gte: startDate,
      $lte: endDate
    }
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total_sessions: { $sum: 1 },
        avg_duration: { $avg: '$session_duration' },
        avg_messages: { $avg: '$total_messages' },
        total_messages: { $sum: '$total_messages' },
        avg_satisfaction: { $avg: '$satisfaction_rating.rating' }
      }
    }
  ]);
};

export default mongoose.model('ChatSession', chatSessionSchema);