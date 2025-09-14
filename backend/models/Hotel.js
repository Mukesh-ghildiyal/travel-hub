const mongoose = require('mongoose');

// Language-specific content schema
const languageContentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false // Make optional to allow partial language data
  },
  description: {
    type: String,
    required: false // Make optional to allow partial language data
  }
}, { _id: false });

// Room type schema
const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  facilities: [{
    type: String,
    trim: true
  }]
}, { _id: false });

// Nearby attraction schema
const nearbyAttractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  distance: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Photo schema
const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [200, 'Caption cannot exceed 200 characters']
  }
}, { _id: false });

// Main hotel schema with dynamic fields support
const hotelSchema = new mongoose.Schema({
  // Core required fields
  name: {
    type: String,
    required: true,
    trim: true
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  priceFrom: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerNight: {
    type: Number,
    min: 0
  },
  roomTypes: [roomTypeSchema],
  nearbyAttractions: [nearbyAttractionSchema],
  amenities: [{
    type: String,
    trim: true
  }],
  
  // Optional fields
  imageUrl: {
    type: String,
    trim: true
  },
  photos: [photoSchema],
  
  // Multilingual support
  language: {
    en: languageContentSchema,
    ar: languageContentSchema
  },
  
  // Dynamic fields - any additional fields will be stored
  // This allows for flexible schema evolution
}, {
  timestamps: true,
  strict: false, // This allows dynamic fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for populated destination
hotelSchema.virtual('destination', {
  ref: 'Destination',
  localField: 'destinationId',
  foreignField: '_id',
  justOne: true
});

// Indexes for better query performance
hotelSchema.index({ destinationId: 1 });
hotelSchema.index({ name: 1 });
hotelSchema.index({ pricePerNight: 1 });
hotelSchema.index({ rating: -1 });

// Pre-save middleware to set default language content if not provided
hotelSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name') || this.isModified('description')) {
    // Set default language content if not provided
    if (!this.language) {
      this.language = {};
    }
    
    // Set English content if not provided or empty
    if (!this.language.en || !this.language.en.name || !this.language.en.description) {
      this.language.en = {
        name: this.language.en?.name || this.name,
        description: this.language.en?.description || this.description
      };
    }
    
    // Set Arabic content if not provided or empty
    if (!this.language.ar || !this.language.ar.name || !this.language.ar.description) {
      this.language.ar = {
        name: this.language.ar?.name || this.name,
        description: this.language.ar?.description || this.description
      };
    }
  }
  next();
});

// Pre-find middleware to populate destination
hotelSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'destinationId',
    select: 'name country description imageUrl language'
  });
  next();
});

module.exports = mongoose.model('Hotel', hotelSchema);
