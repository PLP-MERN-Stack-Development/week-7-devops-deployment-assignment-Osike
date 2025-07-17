import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    index: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'general',
      'constitution',
      'bill-of-rights',
      'criminal-law',
      'civil-law',
      'family-law',
      'employment',
      'landlord-tenant',
      'human-rights',
      'court-procedures',
      'legal-aid',
      'mombasa-specific'
    ],
    index: true
  },
  keywords: [{
    type: String,
    lowercase: true,
    index: true
  }],
  related_articles: [{
    type: Number,
    ref: 'ConstitutionArticle'
  }],
  related_topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalTopic'
  }],
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  view_count: {
    type: Number,
    default: 0
  },
  helpful_votes: {
    type: Number,
    default: 0
  },
  not_helpful_votes: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  created_by: {
    type: String,
    default: 'system'
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
faqSchema.index({ category: 1, priority: -1 });
faqSchema.index({ keywords: 1 });
faqSchema.index({ is_active: 1, view_count: -1 });
faqSchema.index({ '$**': 'text' }); // Text search index

// Virtual for helpfulness ratio
faqSchema.virtual('helpfulness_ratio').get(function() {
  const total = this.helpful_votes + this.not_helpful_votes;
  return total > 0 ? (this.helpful_votes / total) * 100 : 0;
});

// Static method to search FAQs
faqSchema.statics.searchFAQs = function(query, category = null) {
  const searchQuery = {
    is_active: true,
    $or: [
      { question: { $regex: query, $options: 'i' } },
      { answer: { $regex: query, $options: 'i' } },
      { keywords: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  if (category) {
    searchQuery.category = category;
  }

  return this.find(searchQuery)
    .populate('related_articles')
    .populate('related_topics')
    .sort({ priority: -1, view_count: -1 });
};

// Static method to get popular FAQs
faqSchema.statics.getPopularFAQs = function(limit = 10) {
  return this.find({ is_active: true })
    .populate('related_articles')
    .sort({ view_count: -1, helpful_votes: -1 })
    .limit(limit);
};

// Static method to get FAQs by category
faqSchema.statics.getFAQsByCategory = function(category) {
  return this.find({ category, is_active: true })
    .populate('related_articles')
    .populate('related_topics')
    .sort({ priority: -1, view_count: -1 });
};

// Instance method to increment view count
faqSchema.methods.incrementViewCount = function() {
  this.view_count += 1;
  return this.save();
};

// Instance method to vote helpful
faqSchema.methods.voteHelpful = function() {
  this.helpful_votes += 1;
  return this.save();
};

// Instance method to vote not helpful
faqSchema.methods.voteNotHelpful = function() {
  this.not_helpful_votes += 1;
  return this.save();
};

export default mongoose.model('FAQ', faqSchema);