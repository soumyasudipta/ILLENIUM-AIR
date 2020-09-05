// Import Libraries
const express = require('express')

// Init Router
const router = express.Router()

// Load Models
const Inventory = require("../../models/Inventory")
const Bill = require('../../models/Bill')

/*
###################### ROUTES ######################
*/
// Default Route
router.get('/', (req, res) => res.send("Inventory Route Working"))

// Inventory Add Route
router.post('/create', async (req, res) => {
    // Get URL Params
    const productID = req.body.id
    const name = req.body.name
    const brand = req.body.brand
    const mrp = req.body.mrp
    const weight = req.body.weight
    const quantity = req.body.quantity

    // Get result from database operation
    const result = await Inventory.create({ _id: productID, name, brand, mrp, weight, quantity})
                                    .then(res => { 
                                        // Return Result message
                                        return [{code: 200, msg: res}]
                                    })
                                    .catch(err => {
                                        // Return Error message 
                                        return [{code: 404, msg: err}] 
                                    })
    
    // Send result back 
    res.send(result)
})

// Get Data
router.get('/search', async (req, res) => {
    // Get URL Params
    const name = req.query.name

    // Get result from database operation
    const result = await Inventory.find({name: new RegExp(`.*${name}.*`, 'i')})
                                    .then(res => { 
                                        // Return result message
                                        return [{ code: 200, msg: res}] 
                                    })
                                    .catch(err => { 
                                        // Return error message
                                        return [{ code: 404, msg: err}]
                                    })
    
    // Send result back
    res.send(result)

})

// Inventory Update Route
router.put('/update', async (req, res) => {
    // Get URL Params
    const productID = req.body.id
    const quantity = parseInt(req.body.quantity)

    // Get result from database operation
    const result = await Inventory.updateOne({ _id: productID }, { $inc: { quantity : quantity } })
                                    .then(res => { 
                                        // Return Result message
                                        if(res['nModified'] === 1)    
                                            return [{code: 200, msg: productID + ' updated'}] 
                                        else
                                            return [{code: 200, msg: productID + ' not Found'}]
                                    })
                                    .catch(err => {
                                        // Return Error message 
                                        return [{code: 404, msg: err}] 
                                    })

    // Send result back
    res.send(result)
})

// Inventory Delete Route
router.delete('/delete', async (req, res) => {
    // Get URL Params
    const productID = req.query.id

    // Get result from database operation
    const result = await Inventory.deleteOne({ _id: productID})
                                    .then(res => {
                                        // Return Result message
                                        if (res['deletedCount'] === 1)
                                            return [{code: 200, msg: productID + " Deleted"}]
                                        else
                                            return [{code: 200, msg: productID + " Not Found"}]
                                    })
                                    .catch(err => {
                                        // Return Error message
                                        return [{code: 404, msg: err}]
                                    })
    // Send result back
    res.send(result)
})

// Payment Route
router.put('/payment', async (req, res) => {
    // Get URL Params
    const id = req.query.id
    
    // Get result from database operation
    const result = await Bill.findOne({ _id: id }, { payment : 1})
                    .then(async res => {
                        // Check if payment is done
                        if(res['payment'] == false) {
                            // Update Payment Status of the Order
                            await Bill.updateOne({ _id:id }, { $set: { payment: true } })
                                    .then( async res => {
                                        // If Payment status changed
                                        if(res['nModified'] == 1) {
                                            // Get all items from Order 
                                            const items = await Bill.findOne({ _id: id }, { _id: 0, items: 1 })
                                                                    .then(res => { return res['items'] })
                                                                    .catch(err => { console.log(err) })
                                            
                                            // Update Inventory
                                            for (item of items) {
                                                await Inventory.updateOne({ _id: item['product'] }, { $inc: { quantity: -item['quantity'] } })
                                                                .catch(err => { console.log(err)})
                                            }
                                        } else {
                                            // Return Payment Status 
                                            return [{code: 200, msg: 'Could not proceed with the payment'}]
                                        }
                                    })
                                    .catch(err => {
                                        // Return Error
                                        return [{code: 404, msg: err}]
                                    })
                                // Return Payment Status 
                                return [{code: 200, msg: "Payment Successful!!, Thank you for shopping"}]
                        } else {
                            // Return Payment Status
                            return [{code: 200, msg: 'Bill Already Paid'}]
                        }
                    })
                    .catch(err => {
                        // Return Error
                        return [{code: 404, msg: err}]
                    })

    // Send result back
    res.send(result)
})

/*
###################### METHODS ######################
*/
async function getOrder(id) {
    return Bill.findOne({ _id:id }, {_id:0, items:1})
                .then(res => { return res['items'] })
                .catch(err => { console.log(err) })

}

module.exports = router