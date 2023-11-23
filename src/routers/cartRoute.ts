import express from 'express'
import {
  addToCart,
  updateCartItems,
  getCartItems,
  deleteCartItem,
} from '../controllers/cartController'
import { validateObjectId } from '../middlewares/validateObjectId'

const router = express.Router()

router.post('/', addToCart)
router.put('/:id', validateObjectId, updateCartItems)
router.get('/:id', validateObjectId, getCartItems)
router.delete('/:id', deleteCartItem)

export default router
