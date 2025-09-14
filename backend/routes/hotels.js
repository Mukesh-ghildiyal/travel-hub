const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Destination = require('../models/Destination');

// @route   GET /api/hotels
// @desc    Get all hotels
// @access  Public
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: hotels,
      count: hotels.length
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotels',
      error: error.message
    });
  }
});

// @route   GET /api/hotels/destination/:destinationId
// @desc    Get hotels by destination ID
// @access  Public
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const hotels = await Hotel.find({ destinationId: req.params.destinationId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: hotels,
      count: hotels.length
    });
  } catch (error) {
    console.error('Error fetching hotels by destination:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotels by destination',
      error: error.message
    });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get hotel by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotel',
      error: error.message
    });
  }
});

// @route   POST /api/hotels
// @desc    Create new hotel
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      destinationId, 
      description, 
      pricePerNight, 
      rating, 
      amenities, 
      imageUrl, 
      language, 
      ...dynamicFields 
    } = req.body;
    
    // Validate required fields
    if (!name || !destinationId || !description || pricePerNight === undefined || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, destinationId, description, pricePerNight, and rating are required'
      });
    }
    
    // Validate destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    // Validate rating range
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }
    
    // Validate price
    if (pricePerNight < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price per night must be positive'
      });
    }
    
    // Create hotel with dynamic fields
    const hotelData = {
      name,
      destinationId,
      description,
      pricePerNight,
      rating,
      amenities: amenities || [],
      imageUrl,
      language,
      ...dynamicFields // Include any additional dynamic fields
    };
    
    const hotel = new Hotel(hotelData);
    await hotel.save();
    
    res.status(201).json({
      success: true,
      data: hotel,
      message: 'Hotel created successfully'
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating hotel',
      error: error.message
    });
  }
});

// @route   PUT /api/hotels/:id
// @desc    Update hotel
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      destinationId, 
      description, 
      pricePerNight, 
      rating, 
      amenities, 
      imageUrl, 
      language, 
      ...dynamicFields 
    } = req.body;
    
    // Validate destination if provided
    if (destinationId) {
      const destination = await Destination.findById(destinationId);
      if (!destination) {
        return res.status(400).json({
          success: false,
          message: 'Destination not found'
        });
      }
    }
    
    // Validate rating range if provided
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }
    
    // Validate price if provided
    if (pricePerNight !== undefined && pricePerNight < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price per night must be positive'
      });
    }
    
    const updateData = {
      name,
      destinationId,
      description,
      pricePerNight,
      rating,
      amenities,
      imageUrl,
      language,
      ...dynamicFields // Include any additional dynamic fields
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    res.json({
      success: true,
      data: hotel,
      message: 'Hotel updated successfully'
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating hotel',
      error: error.message
    });
  }
});

// @route   DELETE /api/hotels/:id
// @desc    Delete hotel
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting hotel',
      error: error.message
    });
  }
});

// @route   GET /api/hotels/search/filter
// @desc    Filter hotels by various criteria
// @access  Public
router.get('/search/filter', async (req, res) => {
  try {
    const { 
      destinationId, 
      minPrice, 
      maxPrice, 
      minRating, 
      maxRating,
      amenities,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filter = {};
    
    // Filter by destination
    if (destinationId) {
      filter.destinationId = destinationId;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = parseFloat(maxPrice);
    }
    
    // Filter by rating range
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }
    
    // Filter by amenities
    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
      filter.amenities = { $in: amenityArray };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const hotels = await Hotel.find(filter).sort(sortOptions);
    
    res.json({
      success: true,
      data: hotels,
      count: hotels.length,
      filters: {
        destinationId,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
        amenities
      }
    });
  } catch (error) {
    console.error('Error filtering hotels:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while filtering hotels',
      error: error.message
    });
  }
});

module.exports = router;

