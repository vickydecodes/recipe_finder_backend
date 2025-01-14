const axios = require('axios');
const mongoose = require('mongoose');
const Recipe = require('./model/recipe'); 

const DB_URI = 'mongodb+srv://vignesh:harisha260206@cluster0.d2siq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'||'mongodb://localhost:27017/recipe_db';

const seedDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Database connected');

    const response = await axios.get('https://dummyjson.com/recipes?limit=0');
    const recipes = response.data.recipes;

    await Recipe.insertMany(recipes);
    console.log(`Seeded ${recipes.length} recipes into the database`);

    

    mongoose.connection.close();
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};

seedDatabase();
