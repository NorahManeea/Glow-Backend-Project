import express from 'express'
const router = express.Router()

import { getAllProducts } from '../controllers/productController'


router.get("/", getAllProducts)


export default router
