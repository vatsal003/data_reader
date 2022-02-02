const Seller = require('../models/seller')
const SellerService = {}

SellerService.register = async function (sellerBody){
    try{
        const seller = await new Seller(sellerBody).save()
        return {seller}

    } catch (e) {
        if (e.name == "ValidationError"){
            return {error:e.message}
        }
        if (e.code == 11000){
            return {error:"Seller ID already exists!"}
        }
        throw new Error(e)    
    }
}


SellerService.login = async function (sellerBody){
    try{
        const seller = await Seller.findByCredentials(sellerBody.sellerId,sellerBody.password)
        const token = await seller.generateAuthToken()
        return {seller,token}

    } catch (e) {
        console.log(e)
        if (e.name == "LoginError"){
            return {error:e.message}
        }
        throw new Error(e)    
    }
}

module.exports = SellerService
