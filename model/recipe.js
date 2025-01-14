const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String], 
    required: true,
  },
  instructions: {
    type: [String], 
    required: true,
  },
  prepTimeMinutes: {
    type: Number,
    required: true,
  },
  cookTimeMinutes: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  caloriesPerServing: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String], 
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  reviewCount: {
    type: Number,
    required: true,
  },
  mealType: {
    type: [String], 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
