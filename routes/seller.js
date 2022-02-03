const express = require('express')
const SellerService = require('../services/seller')
const router = new express.Router()

router.post('/register', async(req, res) => {
    try{
        const sellerBody = {}
        let errormsg = ""
        req.body.sellerId ? sellerBody.sellerId = req.body.sellerId : errormsg += "Seller ID missing!\n"
        req.body.password ? sellerBody.password = req.body.password : errormsg += "Password missing!\n"
        if(errormsg != ""){
            return {error:errormsg}
        }
        const result = await SellerService.register(sellerBody)
        if (result.seller) {
            return res.status(200).send(result)
        }
        else{
            return res.status(400).send(result)
        }
    } catch (e) {
        return res.status(500).send({error:e.message})

    }
})


router.post('/login', async(req, res) => {
    try{
        const sellerBody = {}
        let errormsg = ""
        req.body.sellerId ? sellerBody.sellerId = req.body.sellerId : errormsg += "Seller ID missing!\n"
        req.body.password ? sellerBody.password = req.body.password : errormsg += "Password missing!\n"
        if(errormsg != ""){
            return {error:errormsg}
        }
        const result = await SellerService.login(sellerBody)
        if (result.seller) {
            return res.status(200).send(result)
        }
        else{
            return res.status(400).send(result)
        }
    } catch (e) {
        //console.log(e)
        return res.status(500).send({error:e.message})

    }
})

module.exports = router