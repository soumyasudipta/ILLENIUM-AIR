const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BillSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  totalprice: {
    type: Number,
    required: true
  },
  totalitems: {
    type: Number,
    required: true
  },
  payment: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Bill = mongoose.model("orders", BillSchema)