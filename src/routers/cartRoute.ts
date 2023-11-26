import express from 'express'
import {
  addToCart,
  updateCartItems,
  getCartItems,
  deleteCartItem,
} from '../controllers/cartController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { validateCart } from '../validation/validateCart'


const router = express.Router()

router.post('/',addToCart)
router.put('/:id', validateObjectId,validateCart, updateCartItems)
router.get('/:id', validateObjectId, getCartItems)
router.delete('/:id', deleteCartItem)

export default router
