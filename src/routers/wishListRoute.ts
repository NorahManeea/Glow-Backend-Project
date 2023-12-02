import express from 'express'
import { addToWishList, deleteFromWishList, getWishList } from '../controllers/wishListController'
import { checkAuth } from '../middlewares/verifyToken'
import { validateObjectId } from '../middlewares/validateObjectId'

const router = express.Router()

router.post('/', checkAuth, addToWishList)
router.get('/', checkAuth, getWishList)
router.delete('/:wishListId', checkAuth, validateObjectId('wishListId'), deleteFromWishList)

export default router
