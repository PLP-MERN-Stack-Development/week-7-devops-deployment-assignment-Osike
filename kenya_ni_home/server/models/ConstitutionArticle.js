import mongoose from 'mongoose';

const constitutionArticleSchema = new mongoose.Schema({
  article_number: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  chapter_number: {
    type: Number,
    required: true,
    index: true
  },
  chapter_title: {
    type: String,
    required: true,
    index: true
  },
  part_title: {
    type: String,
    default: null
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  full_text: {
    type: String,
    required: true,
    index: 'text' // Text index for search functionality
  },
  keywords: [{
    type: String,
    lowercase: true,
    index: true
  }],
  section_headings: [{
    section: String,
    content: String
  }],
  is_bill_of_rights_article: {
    type: Boolean,
    default: false,
    index: true
  },
  related_articles: [{
    type: Number,
    ref: 'ConstitutionArticle'
  }],
  summary: {
    type: String,
    maxlength: 500
  },
  practical_examples: [{
    type: String
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
constitutionArticleSchema.index({ chapter_number: 1, article_number: 1 });
constitutionArticleSchema.index({ is_bill_of_rights_article: 1, article_number: 1 });
constitutionArticleSchema.index({ keywords: 1 });
constitutionArticleSchema.index({ '$**': 'text' }); // Compound text index

// Virtual for article reference
constitutionArticleSchema.virtual('article_reference').get(function() {
  return `Article ${this.article_number}`;
});

// Virtual for chapter reference
constitutionArticleSchema.virtual('chapter_reference').get(function() {
  return `Chapter ${this.chapter_number}`;
});

// Static method to find Bill of Rights articles
constitutionArticleSchema.statics.findBillOfRightsArticles = function() {
  return this.find({ is_bill_of_rights_article: true }).sort({ article_number: 1 });
};

// Static method to search articles
constitutionArticleSchema.statics.searchArticles = function(query, options = {}) {
  const searchQuery = {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { full_text: { $regex: query, $options: 'i' } },
      { keywords: { $in: [new RegExp(query, 'i')] } },
      { chapter_title: { $regex: query, $options: 'i' } }
    ]
  };

  if (options.billOfRightsOnly) {
    searchQuery.is_bill_of_rights_article = true;
  }

  if (options.chapter) {
    searchQuery.chapter_number = options.chapter;
  }

  return this.find(searchQuery)
    .sort({ article_number: 1 })
    .limit(options.limit || 20);
};

// Instance method to get related articles
constitutionArticleSchema.methods.getRelatedArticles = function() {
  return this.constructor.find({
    _id: { $in: this.related_articles }
  }).sort({ article_number: 1 });
};

// Pre-save middleware to update timestamps
constitutionArticleSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Pre-save middleware to set Bill of Rights flag
constitutionArticleSchema.pre('save', function(next) {
  // Chapter 4 contains the Bill of Rights (Articles 19-58)
  if (this.chapter_number === 4 && this.article_number >= 19 && this.article_number <= 58) {
    this.is_bill_of_rights_article = true;
  }
  next();
});

export default mongoose.model('ConstitutionArticle', constitutionArticleSchema);