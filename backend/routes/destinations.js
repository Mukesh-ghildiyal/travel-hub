const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// @route   GET /api/destinations
// @desc    Get all destinations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: destinations,
      count: destinations.length
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching destinations',
      error: error.message
    });
  }
});

// @route   GET /api/destinations/:id
// @desc    Get destination by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching destination',
      error: error.message
    });
  }
});

// @route   POST /api/destinations
// @desc    Create new destination
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, country, description, imageUrl, language, ...dynamicFields } = req.body;
    
    // Validate required fields
    if (!name || !country || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, country, and description are required'
      });
    }
    
    // Create destination with dynamic fields
    const destinationData = {
      name,
      country,
      description,
      imageUrl,
      language,
      ...dynamicFields // Include any additional dynamic fields
    };
    
    const destination = new Destination(destinationData);
    await destination.save();
    
    res.status(201).json({
      success: true,
      data: destination,
      message: 'Destination created successfully'
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating destination',
      error: error.message
    });
  }
});

// @route   PUT /api/destinations/:id
// @desc    Update destination
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, country, description, imageUrl, language, ...dynamicFields } = req.body;
    
    const updateData = {
      name,
      country,
      description,
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
    
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    res.json({
      success: true,
      data: destination,
      message: 'Destination updated successfully'
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating destination',
      error: error.message
    });
  }
});

// @route   DELETE /api/destinations/:id
// @desc    Delete destination
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting destination',
      error: error.message
    });
  }
});

// @route   GET /api/destinations/:id/hotels
// @desc    Get hotels for a specific destination
// @access  Public
router.get('/:id/hotels', async (req, res) => {
  try {
    const Hotel = require('../models/Hotel');
    const hotels = await Hotel.find({ destinationId: req.params.id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: hotels,
      count: hotels.length
    });
  } catch (error) {
    console.error('Error fetching destination hotels:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching destination hotels',
      error: error.message
    });
  }
});

module.exports = router;

