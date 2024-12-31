const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const sponsorSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,  
  },
  organization: {
    type: String,
    required: true,
    trim: true, 
  },
  sponsorship_value: {
    type: Number,
    required: true,
    min: 0, 
  },
  contact: {
    type: String,
    required: true,
    match: /^[0-9]+$/, 
  },
  notes: {
    type: String,
    trim: true, 
  },
}, {
  timestamps: true,
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.sponsor, sponsorSchema);
