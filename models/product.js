const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number
    },
    cost: {
        type: Number
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Seller'
    }

})

const Product = mongoose.model('Product', productSchema)
module.exports = Product