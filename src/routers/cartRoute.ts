import express from 'express'

import {
  addToCart,
  updateCartItems,
  getCartItems,
  deleteCartById,
  deleteCartItem,
} from '../controllers/cartController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { validateCart } from '../validation/validateCart'
import { checkAuth } from '../middlewares/verifyToken'

const router = express.Router()

router.get('/:id', validateObjectId, getCartItems)
router.post('/', checkAuth,addToCart)
router.put('/:id', validateObjectId, updateCartItems)
router.put('/:id/:productId', deleteCartItem)

router.delete('/:id', deleteCartById)

export default router
