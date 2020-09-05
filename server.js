// Import Libraries
const express = require('express')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const passport = require("passport")

// Initialize Express
const app = express()
const port = 5000

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Routes
const customer = require('./routes/api/customer')
const checkout = require('./routes/api/checkout')
const inventory = require('./routes/api/inventory')

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB successfully connected"))
        .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

app.use('/api/customer', customer)
app.use('/api/checkout', checkout)
app.use('/api/inventory', inventory)

// Home Page
app.get('/', (req, res) => res.send('Server is Working'))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))