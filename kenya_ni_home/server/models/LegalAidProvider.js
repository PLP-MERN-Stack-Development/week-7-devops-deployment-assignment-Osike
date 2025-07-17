import mongoose from 'mongoose';

const legalAidProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'legal-aid-organization',
      'pro-bono-service',
      'government-body',
      'ngo',
      'law-firm',
      'court',
      'tribunal',
      'commission'
    ],
    index: true
  },
  location: {
    county: {
      type: String,
      required: true,
      index: true
    },
    town: String,
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact_info: {
    phone_numbers: [{
      type: String,
      label: String // e.g., 'main', 'emergency', 'hotline'
    }],
    email: String,
    website: String,
    social_media: {
      facebook: String,
      twitter: String,
      linkedin: String
    }
  },
  services_offered: [{
    service_name: String,
    description: String,
    eligibility_criteria: String,
    cost: {
      type: String,
      enum: ['free', 'subsidized', 'fee-for-service', 'sliding-scale']
    }
  }],
  focus_areas: [{
    type: String,
    enum: [
      'criminal-defense',
      'family-law',
      'landlord-tenant',
      'employment-law',
      'human-rights',
      'immigration',
      'disability-rights',
      'gender-based-violence',
      'child-protection',
      'land-disputes',
      'constitutional-matters',
      'administrative-law',
      'commercial-law',
      'debt-recovery',
      'consumer-protection'
    ]
  }],
  target_demographics: [{
    type: String,
    enum: [
      'low-income',
      'women',
      'children',
      'elderly',
      'persons-with-disabilities',
      'refugees',
      'minorities',
      'youth',
      'general-public'
    ]
  }],
  operating_hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
    notes: String
  },
  languages_supported: [{
    type: String,
    default: ['English', 'Kiswahili']
  }],
  accessibility_features: [{
    type: String,
    enum: [
      'wheelchair-accessible',
      'sign-language-interpreter',
      'braille-materials',
      'audio-assistance',
      'multilingual-staff'
    ]
  }],
  emergency_contact: {
    available: {
      type: Boolean,
      default: false
    },
    phone: String,
    hours: String
  },
  verification_status: {
    type: String,
    enum: ['verified', 'pending', 'unverified'],
    default: 'pending'
  },
  last_verified: Date,
  rating: {
    average: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    count: {
      type: Number,
      default: 0
    }
  },
  is_mombasa_based: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
legalAidProviderSchema.index({ 'location.county': 1, type: 1 });
legalAidProviderSchema.index({ focus_areas: 1 });
legalAidProviderSchema.index({ is_mombasa_based: 1, type: 1 });
legalAidProviderSchema.index({ verification_status: 1 });

// Virtual for full address
legalAidProviderSchema.virtual('full_address').get(function() {
  return `${this.location.address}, ${this.location.town ? this.location.town + ', ' : ''}${this.location.county}`;
});

// Virtual for primary phone
legalAidProviderSchema.virtual('primary_phone').get(function() {
  const mainPhone = this.contact_info.phone_numbers.find(p => p.label === 'main');
  return mainPhone ? mainPhone.type : this.contact_info.phone_numbers[0]?.type;
});

// Static method to find Mombasa providers
legalAidProviderSchema.statics.findMombasaProviders = function(focusArea = null) {
  const query = { is_mombasa_based: true };
  if (focusArea) {
    query.focus_areas = focusArea;
  }
  return this.find(query).sort({ name: 1 });
};

// Static method to search providers
legalAidProviderSchema.statics.searchProviders = function(query, filters = {}) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { 'services_offered.service_name': { $regex: query, $options: 'i' } },
      { focus_areas: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  if (filters.county) {
    searchQuery['location.county'] = filters.county;
  }

  if (filters.type) {
    searchQuery.type = filters.type;
  }

  if (filters.focusArea) {
    searchQuery.focus_areas = filters.focusArea;
  }

  if (filters.mombasaOnly) {
    searchQuery.is_mombasa_based = true;
  }

  return this.find(searchQuery).sort({ name: 1 });
};

// Pre-save middleware to set Mombasa flag
legalAidProviderSchema.pre('save', function(next) {
  if (this.location.county.toLowerCase().includes('mombasa')) {
    this.is_mombasa_based = true;
  }
  next();
});

export default mongoose.model('LegalAidProvider', legalAidProviderSchema);