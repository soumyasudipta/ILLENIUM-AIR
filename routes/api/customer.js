// Import Libraries
const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Init Router
const router = express.Router()

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load models
const User = require('../../models/User')
const Inventory = require("../../models/Inventory")

// Load Key
const keys = require("../../config/keys")
const { secretOrKey } = require("../../config/keys")

/*
###################### ROUTES ######################
*/
// Default Route
router.get('/', (req, res) => res.send("Customer"))

// Registration
router.post("/register", (req, res) => {
    // Form validation
  
    const { errors, isValid } = validateRegisterInput(req.body);
  
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
  
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                _id: req.body.phone,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
    
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }
    });
});

// Login
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }

                // Sign token
                jwt.sign(payload, keys.secretOrKey, {expiresIn: 31556926}, (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    })
                })
            } else {
                return res.status(400).json({ passwordincorrect: "Password incorrect" });
            }
        })
    })
})

// Add to Cart
router.get('/cart/add', verifyToken, async (req, res) => {
    // Get URL Params
    const productID = req.query.productid

    // Verify token
    jwt.verify(req.token, secretOrKey, async (err, authData) => {
        if(err) {
            res.send([{code: 403, result: err}])
        } else {
            const productDetails = await getInventory(productID)
            // Get result from database 
            const result = await insertIntoCart(authData['email'], productID, productDetails['mrp'], productDetails['name'])
            // Send result
            res.send([{code: 200, result}])
        }
    })
})

// Update Cart
router.get('/cart/update', verifyToken, async (req, res) => {
    // Get URL Params
    const productID = req.query.productid
    const quantity = parseInt(req.query.quantity)

    // Verify token
    jwt.verify(req.token, secretOrKey, async (err, authData) => {
        if(err) {
            res.send([{code: 403, result: err}])
        } else {
            // Get result from database 
            const result = await updateCart(authData['email'], productID, quantity)
            // Send result
            res.send([{code: 200, result}])
        }
    })
})


/*
################### VERIFY TOKEN ###################
*/
// Verify Token
function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization']

    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')

        const bearerToken = bearer[1]

        req.token = bearerToken

        next()
    } else {
        res.sendStatus(403)
    }
}


/*
###################### METHODS ######################
*/
// Get Inventory Data
async function getInventory(productID){
    // Find the product details and return 
    return await Inventory.findOne({ _id: productID })
                            .then(res => { return res })
                            .catch(err => { console.log(err) })
}

// Insert to Cart
async function insertIntoCart(email, productID, price, name) {
    // Check if product exists in the cart
    const result = await User.findOne({ email:email}, {cart: { $elemMatch: {product: productID}} })
                            .then(res => { return res['cart'] })
                            .catch(err => { console.log(err)})

    // Check cart data
    if(result.length !== 0) {
        // Update if product does exist and return the cart data
        return await updateCart(email, productID, 1)
    } else {
        // Add if product does not exist
        await User.updateOne({ email: email }, { $push: { cart: { product: productID,name: name, quantity: 1,price: price, totalprice:price } } })
                .then(res => { return res })
                .catch(err =>{ return err })

        // Return the cart data
        return await getCart(email)
    }
}

// Get Cart Data
async function getCart(email) {
    // Return user's cart data
    return await User.findOne({ email: email})
                    .then(res => { return res['cart'] })
                    .catch(err => { console.log(err) })
}

// Update Cart Data
async function updateCart(email, productID, updateQuantity) {
    // Get available quantity from inventory
    const available = await Inventory.findOne({ _id: productID }, { mrp: 1, quantity: 1 })
                                    .then(res => { return res })
                                    .catch(err => { return err })

    // Get added quantity from user's cart
    const quantity = await User.find({ email:email}, {cart: { $elemMatch: { product: productID } } })
                                .then(res => { return res[0]['cart'][0]['quantity'] })
                                .catch(err => { console.log(err) })

    // Check if the produt can be added
    if(quantity + updateQuantity <= available['quantity']) {
        // Remove product if product in cart reaches zero else update the cart
        if(quantity + updateQuantity === 0) {
            await User.updateOne({ email: email}, { $pull: { cart: { product: productID } } })
                        .then(res => { return res })
                        .catch(err => {console.log(err)})['nModified']
        } else {
            await User.updateOne({ email: email, cart: { $elemMatch: {product: productID } }}, {$inc: { 'cart.$.quantity': updateQuantity ,'cart.$.totalprice': available['mrp']*updateQuantity}})
                        .then(res => { return res })
                        .catch(err => {console.log(err)})['nModified']
        }
    }

    // Return cart data
    return await getCart(email)
}

module.exports = router