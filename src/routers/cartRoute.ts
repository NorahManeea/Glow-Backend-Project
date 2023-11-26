import express from 'express'
import {
  addToCart,
  updateCartItems,
  getCartItems,
  deleteCartItem,
} from '../controllers/cartController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { checkAuth } from '../middlewares/verifyToken'

const router = express.Router()

router.post('/', checkAuth,addToCart)
router.put('/:id', validateObjectId, updateCartItems)
router.get('/:id', validateObjectId, getCartItems)
router.delete('/:id',checkAuth, deleteCartItem)

export default router
