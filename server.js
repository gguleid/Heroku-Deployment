//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require ('mongoose');
require('dotenv').config();
const app = express();
const db = mongoose.connection;
const Tea = require('./model/products.js');
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 4007;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

// Error / success
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongod connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongod disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:4007
app.get('/' , (req, res) => {
  res.send('Hello World!');
});

// Index - I need to add a "index.ejs"

app.get('/teashop', (req, res) => {
  Tea.find({}, (error, productTea) => {
      res.render('index.ejs', {
         allProducts: productTea,
          
          
      }
      
      );
  });
});


// New



// Delete



// Update 
app.delete('/teashop/:id', (req, res) => {
  Tea.findByIdAndDelete(req.params.id, (error, deletedTea) => {
      res.send({success: true});
      ;
  });
});


// Create
app.post('/teashop', (req, res) => {
 Tea.create(req.body, (error, createTea) => {
     res.send(createTea);
     res.redirect('/teashop')
 });
});

// Edit



// Show
app.get('/teashop/:id', (req, res) => {
  Tea.findById(req.params.id, (error, selectedTea) => {
      res.send(selectedTea)
  });
});


//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('express is listening on:', PORT));