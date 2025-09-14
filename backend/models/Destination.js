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

// Coordinates schema
const coordinatesSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  lon: {
    type: Number,
    required: true,
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
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

// Main destination schema with dynamic fields support
const destinationSchema = new mongoose.Schema({
  // Core required fields
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Optional fields
  imageUrl: {
    type: String,
    trim: true
  },
  coordinates: coordinatesSchema,
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

// Virtual for hotels count
destinationSchema.virtual('hotelsCount', {
  ref: 'Hotel',
  localField: '_id',
  foreignField: 'destinationId',
  count: true
});

// Index for better query performance
destinationSchema.index({ name: 1, country: 1 });
destinationSchema.index({ country: 1 });

// Pre-save middleware to set default language content if not provided
destinationSchema.pre('save', function(next) {
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

module.exports = mongoose.model('Destination', destinationSchema);
