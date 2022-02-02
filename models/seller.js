const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../^/untitled/Untitled-1')

const sellerSchema = new mongoose.Schema({
    sellerId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,

        validate: {
            validator: function(sellerId) {
                return (/^[a-z0-9_]+$/i).test(sellerId)
            },
            message: "Seller ID should be alphanumeric string with only allowed special charachter being '_' "
          },
    },
    password: {
        type: String,
        required: true,
        minlength: [6,"Minimum password length is 6 characters!"],
        maxlength: [25,"Maximum password length is 25 characters!"]
    },
    token: {
        type: String,
        required: true        
    }

})

sellerSchema.methods.toJSON = function(){
    const seller = this
    const sellerObject = seller.toObject()

    delete sellerObject.password
    delete sellerObject.token

    return sellerObject
}

seller.methods.generateAuthToken = async function(){
    const seller = this
    const token = jwt.sign({ _id: seller._id.toString()}, process.env.JWT_SECRET)
    seller.token = token
    await seller.save()

    return token
}

sellerSchema.statics.findByCredentials = async (sellerId,password) => {
    const seller = await Seller.findOne({ sellerId })
    if (!seller){
        throw new Error("Seller not found!")
    }
    const isMatch = await bcrypt.compare(password, seller.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return seller
}

sellerSchema.pre('save', async function(next){
    const seller = this
    if (seller.isModified("password")) {
        seller.password = await bcrypt.hash(seller.password, 8)
    }
    next()
})

const Seller = mongoose.model('Seller' , sellerSchema)
module.exports = Seller