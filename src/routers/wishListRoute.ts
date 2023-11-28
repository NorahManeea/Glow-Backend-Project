import express from 'express'
import { addToWishList, deleteFromWishList, getWishList } from '../controllers/wishListController'
import { checkAuth } from '../middlewares/verifyToken'

const router = express.Router()

router.post('/', checkAuth, addToWishList)
router.get('/', checkAuth, getWishList)
router.delete('/:id', checkAuth, deleteFromWishList)

export default router
