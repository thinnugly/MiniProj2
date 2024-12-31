const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const expertSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,  
  },
  institution: {
    type: String,
    required: true,
    trim: true, 
  },
  areas_expertise: {
    type: [String],  
    required: true,
    trim: true, 
  },
  contacto: {
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

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.expert, expertSchema);
