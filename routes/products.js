const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { logError, checkMissingParams } = require('../utils/commonfunction');
const { serverErrorResponse, missingParamResponse, successResponse, validationErrorResponse, createdResponse } = require('../utils/apifunctions');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res)=>{
    try {
        const products = await Product.find();
        if(products?.length){
            const formattedProductData = products.map((obj)=>{
                const { _id= '', name='', price=0, category='', description='' } = obj || {};
                return {
                    id: _id,
                    productName: name,
                    price: price,
                    category: category,
                    detail: description,
                }
            })
            return successResponse(res, formattedProductData);
        }
        return successResponse(res, []);
    } catch(error){
        logError(`get_/api/products`, error.message);
        return serverErrorResponse(res, error.message);
    }
})

router.post('/', auth, async (req, res)=> {
    try {
        const {name=null, price=null, category=null, detail=null} = req.body || {};
        const paramNames = ["name", "price", "category"];

        const missingParams = checkMissingParams(req.body, paramNames);
        
        if(missingParams){
            return missingParamResponse(res, missingParams);
        }

        if (typeof price !== 'number' || isNaN(price) || price <= 0) {
            return validationErrorResponse(res, { price: 'Price must be a valid non-negative number (integer or float).' });
        }

        const product = new Product({...req.body, description: detail || ''});
        await product.save();

        return createdResponse(res, product);
    } catch(error){
        logError(`post_/api/products`, error.message);
        return serverErrorResponse(res, error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) return missingParamResponse(res, 'product id missing');
        if (!mongoose.Types.ObjectId.isValid(id))  return validationErrorResponse(res, 'Invalid product ID');

        const product = await Product.findById(id);
        
        if (!product) {
            return notFoundResponse(res, 'Product not found');
        }
        const { _id= '', name='', price=0, category='', description='' } = product || {};
        const formattedProductData = {
            id: _id,
            productName: name,
            price: price,
            category: category,
            detail: description,
        }
        return successResponse(res, formattedProductData);
    } catch (error) {
        logError(`get_/api/products/:id`, error.message);
        return serverErrorResponse(res, error.message);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params; 
        const {name=null, price=null, category=null, detail=null} = req.body || {};

        if (!id) return missingParamResponse(res, 'product id missing');
        if (!mongoose.Types.ObjectId.isValid(id))  return validationErrorResponse(res, 'Invalid product ID');

        const payload = {};
        if(name) payload.name = name;
        if (detail !== undefined) payload.description = detail; 
        if(category) payload.category = category;
        if (!(typeof price !== 'number' || isNaN(price) || price <= 0)) {if(price) payload.price = price;};

        const product = await Product.findByIdAndUpdate(id, payload, { new: true });
     
        const formattedProductData = {
            id: product['_id'] || '',
            productName: product?.name || '',
            price: product?.price || '',
            category: product?.category || '',
            detail: product?.description || '',
        }
        return successResponse(res, formattedProductData);
    } catch(error){
        logError(`put_/api/products/:id`, error.message);
        return serverErrorResponse(res, error.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) return missingParamResponse(res, 'product id missing');
        if (!mongoose.Types.ObjectId.isValid(id))  return validationErrorResponse(res, 'Invalid product ID');

        const response = await Product.findByIdAndDelete(id);
        if(response) return successResponse(res, 'Product deleted successfully');
        return successResponse(res, 'Product deleted failed');
    } catch(error) {
        logError(`delete_/api/products/:id`, error.message);
        return serverErrorResponse(res, error.message);
    }
});


module.exports = router;