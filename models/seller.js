const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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
        minlength: [6,"Minimum password length is 6 characters!"]
    },
    token: {
        default:null,
        type: String,
             
    }

})


sellerSchema.methods.toJSON = function(){
    const seller = this
    const sellerObject = seller.toObject()

    delete sellerObject.password
    delete sellerObject.token

    return sellerObject
}

sellerSchema.methods.generateAuthToken = async function(){
    const seller = this
    const token = jwt.sign({ _id: seller._id.toString()}, process.env.JWT_SECRET)
    seller.token = token
    await seller.save()
    return token
}

sellerSchema.statics.findByCredentials = async (sellerId,password) => {
    const seller = await Seller.findOne({ sellerId })
    if (!seller){
        const sellerError = Error.prototype
        sellerError.message = "Seller not found!"
        sellerError.name = "LoginError"
        throw sellerError
    }
    const isMatch = await bcrypt.compare(password, seller.password)
    if (!isMatch) {
        const sellerError = Error.prototype
        sellerError.message = "Unable to login!"
        sellerError.name = "LoginError"
        throw sellerError
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