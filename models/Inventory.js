const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InventorySchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

module.exports = Inventory = mongoose.model("inventories", InventorySchema)