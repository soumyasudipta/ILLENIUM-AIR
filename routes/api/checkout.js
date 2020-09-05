const express = require('express')
const mongodb = require('mongodb')
const jwt = require('jsonwebtoken')

// Init Router
const router = express.Router()

// Connection String for MongoDB
const connection_string = encodeURI('mongodb+srv://illenium_backend:Sc97s820skQKJWQb@illenium.lyr07.gcp.mongodb.net/illenium?retryWrites=true&w=majority')

// constants


// Load Bill model
const User = require('../../models/User')
const Bill = require('../../models/Bill')

//Get Methods
router.get('/',(req,res) => res.send("checkout"))

router.get('/process', verifyToken, async (req ,res)=>{

    jwt.verify(req.token, 'illenium', async (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            const result = await checkout(authData['email'])

            if(result == 0) {
                res.send([{code: 404, result}])
            } else {
                res.send([{code: 200, result}])
            }
        }
    })

})

router.get('/generate', verifyToken, async (req, res)=> {

    jwt.verify(req.token, 'illenium', async (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            const result = await createBill(authData['email'])

            if(result.length == 0)
                res.send([{code: 404, result}])
            else 
                res.send([{code: 200, result}])
        }
    })
})

router.get('/orders', verifyToken, async (req, res)=> {
    jwt.verify(req.token, 'illenium', async (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            const result = await getOrders(authData['email'])

            if(result.length == 0) {
                res.send([{code: 404, result}])
            } else {
                res.send([{code: 200, result}])
            }
        }
    })
})

router.get('/orders/:id', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'illenium', async (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            let result = await getInvoiceDetails(authData['email'], req.params.id)

            if(result.length == 0) {
                res.send([{code: 404, result}])
            } else {
                res.send([{code: 200, result}])
            }
        }
    })
})


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
    Database Methods
*/

async function getOrders(email) {
    return await Bill.find({ email: email })
                    .sort({_id: -1})
                    .then( res => { return res })
                    .catch(err => { console.log(err) })
}

async function getCart(email) {
    return await User.find({ email: email }, { cart: 1 })
                    .then(res => { return res[0]['cart'] })
                    .catch(err => { console.log(err) })
}

async function updateCart(email) {
    return await User.updateOne({ email: email }, { $set: { cart: [] } })
                    .then()
                    .catch(err => { console.log(err) })
}

function getCurrentDate() {
    let today = new Date();

    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();

    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;

    today = yyyy+mm+dd;
    
    return today
}


async function generateOrderID() {
    const client = await connectDB()

    const today = getCurrentDate()

    const result = await Bill.find({ _id: { $regex: today } } , { _id: 1 })
                            .sort({ _id: -1 })
                            .limit(1)
                            .then(res => { return res })
                            .catch(err => { console.log(err) })
    
    let generatedID = ''

    if (result.length === 0) {
        generatedID = today+'000001'
    } else {
        generatedID = String(parseInt(result[0]['_id']) + 1)
    }

    client.close()
    return generatedID
}

async function getInventory(products) {
    const client = await connectDB()
    const available = await client
        .db('illenium')
        .collection('inventories')
        .find({ _id: {$in: products}} , { projection:{ }})
        .toArray()

    client.close()

    if (available.length > 0) { 
        return available
    } else {
        return 0
    }
}

async function checkout(email) {
    const cart = await getCart(email)
    if(cart.length == 0) return 0

    let productIds = []
    for (x of cart) {
        productIds.push(x['product'])
    }

    const inventory = await getInventory(productIds)

    if(inventory == 0) return 0

    let msg = []
    for (x of cart) {
        for (y of inventory) {
            if (x['product'] == y['_id']) {
                if (x['quantity'] > y['quantity']) {
                    msg.push({'product': x['product'], 'quantity': x['quantity'] - y['quantity']})
                }
            }
        }
    }

    if (msg.length > 0) return 0
    
    return cart
    
}

async function createBill(email) {
    return await User.findOne({ email: email }, { cart: 1 })
                    .then(async cart => {
                        if(cart['cart'].length > 0) {
                            let orderID = String(await generateOrderID())

                            let totalprice = 0
                            let totalitems = 0
                            
                            for(x of cart['cart']) {
                                totalitems += x['quantity']
                                totalprice += x['totalprice']
                            }
                            
                            const newBill = new Bill({
                                _id: orderID,
                                email:email,
                                items: cart['cart'],
                                totalprice: totalprice,
                                totalitems: totalitems,
                                payment: false
                            })
                            
                            const bill = await newBill.save()
                                .then(async bill => {
                                    await updateCart(email)
                                    return bill
                                })
                                .catch(err => console.log(err))

                            return bill
                        } else {
                            return []
                        }
                    }).catch( err => {return err})
}

async function getInvoiceDetails(email, invoiceID) {
    return await Bill.find({ email, email, _id: invoiceID })
                    .then(res => { return res })
                    .catch(err => { console.log(err) })
}
 
async function connectDB() {
    const client = await mongodb.MongoClient.connect(connection_string, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })

    return client
}

module.exports = router