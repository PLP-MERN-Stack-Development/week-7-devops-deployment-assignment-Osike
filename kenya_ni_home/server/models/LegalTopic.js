import mongoose from 'mongoose';

const legalTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'landlord-tenant',
      'criminal-law',
      'family-law',
      'employment-law',
      'human-rights',
      'civil-procedure',
      'constitutional-law',
      'commercial-law',
      'land-law',
      'administrative-law'
    ],
    index: true
  },
  keywords: [{
    type: String,
    lowercase: true,
    index: true
  }],
  summary: {
    type: String,
    required: true,
    maxlength: 1000
  },
  detailed_content: [{
    section_title: String,
    content: String,
    subsections: [{
      title: String,
      content: String
    }]
  }],
  relevant_laws: [{
    law_name: String,
    section: String,
    description: String
  }],
  relevant_constitution_articles: [{
    type: Number,
    ref: 'ConstitutionArticle'
  }],
  practical_steps: [{
    step_number: Number,
    description: String,
    required_documents: [String],
    estimated_time: String,
    cost_estimate: String
  }],
  common_scenarios: [{
    scenario: String,
    advice: String,
    legal_basis: String
  }],
  mombasa_specific_info: {
    local_contacts: [{
      organization: String,
      phone: String,
      address: String,
      services: [String]
    }],
    local_procedures: String,
    court_locations: [{
      court_name: String,
      address: String,
      phone: String,
      jurisdiction: String
    }]
  },
  source_urls: [{
    title: String,
    url: String,
    description: String
  }],
  last_updated: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    default: 'system'
  },
  review_status: {
    type: String,
    enum: ['draft', 'reviewed', 'approved', 'needs_update'],
    default: 'draft'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
legalTopicSchema.index({ category: 1, keywords: 1 });
legalTopicSchema.index({ '$**': 'text' }); // Text search index
legalTopicSchema.index({ relevant_constitution_articles: 1 });

// Virtual for related constitution articles
legalTopicSchema.virtual('constitution_articles', {
  ref: 'ConstitutionArticle',
  localField: 'relevant_constitution_articles',
  foreignField: 'article_number'
});

// Static method to search topics
legalTopicSchema.statics.searchTopics = function(query, category = null) {
  const searchQuery = {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { summary: { $regex: query, $options: 'i' } },
      { keywords: { $in: [new RegExp(query, 'i')] } },
      { 'detailed_content.content': { $regex: query, $options: 'i' } }
    ]
  };

  if (category) {
    searchQuery.category = category;
  }

  return this.find(searchQuery)
    .populate('constitution_articles')
    .sort({ title: 1 });
};

// Static method to find by category
legalTopicSchema.statics.findByCategory = function(category) {
  return this.find({ category })
    .populate('constitution_articles')
    .sort({ title: 1 });
};

// Instance method to get related topics
legalTopicSchema.methods.getRelatedTopics = function() {
  return this.constructor.find({
    $and: [
      { _id: { $ne: this._id } },
      {
        $or: [
          { category: this.category },
          { keywords: { $in: this.keywords } },
          { relevant_constitution_articles: { $in: this.relevant_constitution_articles } }
        ]
      }
    ]
  }).limit(5);
};

export default mongoose.model('LegalTopic', legalTopicSchema);