import express from 'express'
const router = express.Router()

import { createProduct, deleteProduct, getAllProducts, getProductById } from '../controllers/productController'


router.get("/",getAllProducts )
router.post("/", createProduct)
router.get("/:id",getProductById )
router.delete("/:id",deleteProduct )



export default router
