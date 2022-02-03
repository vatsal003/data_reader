const express = require('express')

const Auth = require('../middlewares/auth')
const ProductService = require('../services/product')
const router = new express.Router()

const fileDestFolder = 'uploads/'
const multer  = require('multer')
const upload = multer({ dest: fileDestFolder })

const csv = require('csv-parser')
const fs = require('fs')

router.post('/upload-csv', Auth.isLoggedIn, upload.single('productInfo'), async(req, res) => {
    try{
        // const seller = {
        //     _id:"61fa8c5a8308e34494403308"
        // }
        if(!req.file){
            return res.status(400).send({error:"CSV file not found"})
        }
        const productsList = [];
        console.log(req.file)
        fs.createReadStream(fileDestFolder+req.file.filename)
          .pipe(csv())
          .on('data', (data) => productsList.push(data))
          .on('end', async () => {
            console.log(productsList);

            const result = await ProductService.addProductData(req.seller,productsList)
            fs.unlink(fileDestFolder+req.file.filename, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
              });
            return res.status(200).send(result)
          });
    } catch (e) {
        return res.status(500).send({error:e.message})

    }
})

router.post('/update', Auth.isLoggedIn, async(req, res) => {
    try{
        if(req.body.productId){
            const product = {}
            if (req.body.productName) {
                product.productName = req.body.productName
            }
            if (req.body.quantity) {
                product.quantity = req.body.quantity
            }
            if (req.body.cost) {
                product.cost = req.body.cost
            } 
            const result = await ProductService.updateProduct(req.body.productId,product,req.seller._id)       
            return res.status(200).send(result)   
        }
        else{
            return res.status(400).send({error:"Invalid updation"})
        }

    } catch (e) {
        return res.status(500).send({error:e.message})

    }
})

router.post('/delete', Auth.isLoggedIn, async(req, res) => {
    try{
        if(req.body.productId){
            const result = await ProductService.deleteProduct(req.body.productId,req.seller._id)  
            return res.status(200).send(result)        
        }
        else{
            return res.status(400).send({error:"Invalid product"})
        }

    } catch (e) {
        return res.status(500).send({error:e.message})

    }
})

router.get('/findProduct', async(req, res) => {
    try{
        //console.log(req)
        if(req.query.productId){
            const result = await ProductService.findProductById(req.query.productId)  
            return res.status(200).send(result)        
        }
        else{
            return res.status(400).send({error:"Invalid product"})
        }

    } catch (e) {
        return res.status(500).send({error:e.message})

    }
})

router.get('/getProducts', async(req, res) => {
    try{
        const result = await ProductService.getProducts()  
        return res.status(200).send(result)   
    } catch (e) {
        return res.status(500).send({error:e.message})

    }
})



module.exports = router