import express from 'express'
const router = express.Router()

import { createProduct, deleteProduct, getAllProducts, getProductById } from '../controllers/productController'


router.route("/").get(getAllProducts)
router.route('/:id').get(getProductById).delete(deleteProduct)

// Add product route
router.route('/').put(createProduct)

export default router
