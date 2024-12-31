const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const expertAnimalSchema = new Schema({
  expert_id: {
    type: Schema.Types.ObjectId,
    ref: CONFIG.mongodb.collections.expert,
    required: true,
  },
  animal_id: {
    type: Schema.Types.ObjectId,
    ref: CONFIG.mongodb.collections.animal, 
    required: true,
  },
  association_type: {
    type: String,  
    required: true,
    trim: true, 
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.expert_animals, expertAnimalSchema);
