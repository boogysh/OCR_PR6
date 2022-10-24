//requires
const express = require('express')
const app = express()
const path = require('path')

//requires routes
const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user')

//security-requires
require('dotenv').config() //or .config({ path:"../folder/.env"}), if .env is not a root file
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp'); 

//monitoring
const morgan = require('morgan')

//Connecting to mongoDB
const mongoDB = require('./connect_mongodb/mongodb') // after dotenv 

//Parsing  
app.use(express.json())

//Setting CORS headers, to avoid CORS errors  
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//security
app.use( //Helemet to securize headers
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      connectSrc: ["'self'", "wss://video.geekwisdom.net"],
    },
  })
);
app.use(xssClean()); // Protect against XSS attacks
app.use(mongoSanitize());//remove all keys containing prohibited characters 
app.use(hpp());//protect HTTP parameter pollution attacks

//monitoring 
app.use(morgan("tiny"));//middleware to create logs

//Setting routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', stuffRoutes)
app.use('/api/auth', userRoutes)

module.exports = app  



