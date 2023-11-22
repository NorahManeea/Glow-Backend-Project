import express from 'express'
const router = express.Router()

import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productController'
import { validateObjectId } from '../middlewares/validateObjectId'


router.get("/",getAllProducts )
router.post("/", createProduct)
router.get("/:id", validateObjectId,getProductById )
router.delete("/:id",validateObjectId,deleteProduct )
router.put("/:id",validateObjectId,updateProduct )




export default router
