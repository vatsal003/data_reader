const Product = require('../models/product')
const ProductService = {}


ProductService.addProductData = async function (seller,productsList){
    try{
        const products = []
        for(let i = 0; i<productsList.length; i++){
            let product = {}
            if (productsList[i].productName) {
                product.productName = productsList[i].productName
                if (productsList[i].quantity) {
                    product.quantity = parseInt(productsList[i].quantity)
                }
                if (productsList[i].cost) {
                    product.cost = parseInt(productsList[i].cost)
                }
                product.seller = seller._id
                const savedProduct = await new Product(product).save()
                products.push(savedProduct)
            }
        }
        return {products}
    } catch (e) {
        if (e.name == "ValidationError"){
            return {error:e.message}
        }
        throw new Error(e)    
    }
}


ProductService.updateProduct = async function (productId,product,sellerId){
    try{
        const productCurr = await Product.findOne({_id:productId, seller:sellerId})
        if (!productCurr){
            return {error:"Product not found!"}
        }
        for (const [key, value] of Object.entries(product)) {
            productCurr[key] = value
        }
        const newProduct = await productCurr.save()
        return {product:newProduct}
    } catch (e) {
        if (e.name == "ValidationError"){
            return {error:e.message}
        }
        throw new Error(e)    
    }
}

ProductService.deleteProduct = async function (productId,sellerId){
    try{
        const r = await Product.deleteOne({_id:productId,seller:sellerId})
        console.log(r)
        if(r.deletedCount>0){
            return {message:"Product deleted"}
        }
        else{
            return {message:"Product not found"} 
        }
        
    } catch (e) {
        throw new Error(e)    
    }
}

ProductService.findProductById = async function (productId){
    try{
        const product = await Product.findById(productId)
        if(product){
            return {product}
        }
        else{
            return {error:"Product not found"}
        }
        
    } catch (e) {
        throw new Error(e)    
    }
}

ProductService.getProducts = async function (){
    try{
        const products = await Product.find({}).populate('seller','sellerId')
        return {products}
        
    } catch (e) {
        throw new Error(e)    
    }
}


module.exports = ProductService
