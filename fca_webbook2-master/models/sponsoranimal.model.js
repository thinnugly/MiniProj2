const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const sponsorAnimalSchema = new Schema({
  sponsor_id: {
    type: Schema.Types.ObjectId,
    ref: CONFIG.mongodb.collections.sponsor,
    required: true,
  },
  animal_id: {
    type: Schema.Types.ObjectId,
    ref: CONFIG.mongodb.collections.animal, 
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.sponsor_animals, sponsorAnimalSchema);
