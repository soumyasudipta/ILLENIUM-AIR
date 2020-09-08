const express = require('express')
const mongodb = require('mongodb')
const jwt = require('jsonwebtoken')

// Init Router
const router = express.Router()

// Connection String for MongoDB
const connection_string = encodeURI('mongodb+srv://illenium_backend:Sc97s820skQKJWQb@illenium.lyr07.gcp.mongodb.net/illenium?retryWrites=true&w=majority')

// Load Bill model
const User = require('../../models/User')
const Bill = require('../../models/Bill')

//Get Methods
router.get('/',(req,res) => res.send("checkout"))

// Create Invoice
router.get('/invoice/generate', verifyToken, async (req, res)=> {
    jwt.verify(req.token, 'illenium', async (err, authData) => {
        if(err) {
            res.send([{code: 403, result: err}])
        } else {
            const result = await createBill(authData['email'])
            res.send(result)
        }
    })
})

// Get Invoice
router.get('/invoice', verifyToken, async (req, res)=> {
    jwt.verify(req.token, 'illenium', async (err, authData) => {
        if(err) {
            res.send([{code: 403, result: err}])
        } else {
            const result = await getInvoice(authData['email'])
            res.send(result)
        }
    })
})

// Get Invoice Details
router.get('/invoice/:id', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'illenium', async (err, authData) => {
        if(err) {
            res.send([{code: 403, result: err}])
        } else {
            const result = await getInvoiceDetails(authData['email'], req.params.id)
            res.send(result)
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

async function updateCart(email) {
    return await User.updateOne({ email: email }, { $set: { cart: [] } })
                     .then()
                     .catch(err => { console.log(err) })
}

// Get today's date
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

// Geberate Invoice ID
async function generateInvoiceID() {
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

    return generatedID
}

// Create Bill
async function createBill(email) {
    return await User.findOne({ email: email }, { cart: 1 })
                    .then(async cart => {
                        if(cart['cart'].length > 0) {
                            let orderID = String(await generateInvoiceID())

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
                                    return [{code: 200, result:bill}]
                                })
                                .catch(error =>[{code: 404, error}])

                            return bill
                        } else {
                            return [{code: 404, error:"No items found in cart"}]
                        }
                    }).catch( error => { return [{code: 404, error}] })
}

// Get Invoice
async function getInvoice(email) {
    return await Bill.find({ email: email })
                     .sort({_id: -1})
                     .then( result => { return [{code: 200, result}] })
                     .catch( error => { return [{code: 404, error}] })
}

// Get Invoice Details
async function getInvoiceDetails(email, invoiceID) {
    return await Bill.find({ email, email, _id: invoiceID })
                     .then(result => { return [{code: 200, result}] })
                     .catch(error => { return [{code: 404, error}] })
}

module.exports = router