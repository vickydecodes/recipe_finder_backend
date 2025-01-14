const express = require('express');
const mongoose = require('mongoose')
const app = express();
const User = require('./model/user');
const Recipe = require('./model/recipe')
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());


const dbUrl = process.env.DB_URL  || 'mongodb://localhost:27017/recipe_db';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});


app.get('/hello', (req, res) => {
    res.json({
        message: 'Hello World!'
    });
});

app.post('/register', async (req, res) => {
    try {
        const { uid } = req.body;
        const user = new User({ uid });
        await user.save();
        res.json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

app.get('/login', async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findOne({ uid });
        res.json({
            user: user
        })
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

app.post('/like', async (req, res) => {
    try {
      const { uid, id } = req.body;  // Getting user ID and recipe ID
      const user = await User.findOne({ uid }).populate('liked');  // Populating liked recipes
      const recipe = await Recipe.findOne({ id: id });  // Ensure you're querying by 'id' field

      // Check if the recipe has already been liked by comparing 'id' fields
      const alreadyLiked = user.liked.some((like) => like.id === recipe.id);

      if (alreadyLiked) {
        return res.json({
          success: false,
          message: 'Already liked',  // Return message if already liked
        });
      }
  
      // Push the new recipe into the liked array
      user.liked.push(recipe);
      await user.save();
  
      res.json({
        success: true,
        message: 'Liked added successfully',  // Return success message
      });
    } catch (e) {
      console.error('Error:', e.message);  // Log any errors
      res.status(500).json({ message: e.message });  // Return error response
    }
});

  


app.get('/get-all-recipes', async (req, res) => {   
    try {
        const recipes = await Recipe.find();
        res.json({
            recipes: recipes
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

app.get('/check-like', async (req, res) => {
    try {
      const { uid, id } = req.query;
      const user = await User.findOne({ uid }).populate('liked');
      const isLiked = user.liked.some(like => like.id === parseInt(id));
      console.log({user:user, liked: user.liked, id: id})

      console.log(isLiked)
  
      res.json({
        liked: isLiked
      });
    } catch (e) {
      res.status(500).json({
        message: e.message
      });
    }
  });

  app.get('/liked-recipes', async(req, res) => {
    try{
        const {uid} = req.query;
        const user = await User.findOne({uid}).populate('liked');   
        res.json({
            liked: user.liked
        });
    }catch(e){
        res.status(500).json({
            message: e.message
        });
    }
  })


  
  

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
})