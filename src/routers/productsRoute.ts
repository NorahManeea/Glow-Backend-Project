import express from 'express'
const router = express.Router()

import { deleteProduct, getAllProducts, getProductById } from '../controllers/productController'


router.route("/").get(getAllProducts)
router.route('/:id').get(getProductById).delete(deleteProduct)



export default router
