import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productController.js';
import productImageUpload from '../middleware/multer.js'; 
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post(
    '/add',adminAuth,
    productImageUpload,
    addProduct
);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

export default productRouter;



