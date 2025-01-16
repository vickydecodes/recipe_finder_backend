const express = require('express');
const mongoose = require('mongoose')
const app = express();
const User = require('./model/user');
const Recipe = require('./model/recipe')
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());


const dbUrl =  process.env.DB_URL || 'mongodb://localhost:27017/recipe_db';

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
        const { uid, username } = req.body;
        const user = new User({ uid: uid, username: username });
        await user.save();
        res.json({
            success: true,
            user: user,
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
        const { uid } = req.query;
        console.log('uid', uid)
        const user = await User.findOne({ uid: uid });

        res.json({
            user: user, 
            message: 'User logged in successfully',
            success: true
        })
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

app.post('/like', async (req, res) => {
    try {
      const { uid, id } = req.body;  
      const user = await User.findOne({ uid }).populate('liked'); 
      const recipe = await Recipe.findOne({ id: id }); 

      const alreadyLiked = user.liked.some((like) => like.id === recipe.id);

      if (alreadyLiked) {
        return res.json({
          success: false,
          message: 'Already liked', 
        });
      }
  
      user.liked.push(recipe);
      await user.save();
  
      res.json({
        success: true,
        message: 'Liked added successfully', 
      });
    } catch (e) {
      console.error('Error:', e.message); 
      res.status(500).json({ message: e.message }); 
    }
});

app.post('/dislike', async (req, res) => {
    try {
      const { uid, id } = req.body;
      const user = await User.findOne({ uid }).populate('liked');
      const recipeIndex = user.liked.findIndex((like) => like.id === id);
  
      if (recipeIndex === -1) {
        return res.json({
          success: false,
          message: "Recipe not found in liked list",
        });
      }
  
      user.liked.splice(recipeIndex, 1);
      await user.save();
  
      res.json({
        success: true,
        message: "Recipe disliked successfully",
      });
    } catch (e) {
      console.error("Error:", e.message);
      res.status(500).json({ message: e.message });
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

//--DEVELOPMENT SERVER--//

  // app.listen( 3000, '0.0.0.0', () => {
  //   console.log('Server running on port 3000');
  // });
  

//--PRODUCTION SERVER--//
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000');
  });