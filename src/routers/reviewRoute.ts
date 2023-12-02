import express from 'express'
import { addNewReview, deleteReview,getAllReviews } from '../controllers/reviewController'
import { checkAuth } from '../middlewares/verifyToken'
import { validateObjectId } from '../middlewares/validateObjectId'
import { validateReview } from '../validation/validateReview'

const router = express.Router()

router.get('/',getAllReviews)
router.post('/',checkAuth,validateReview,addNewReview)
router.delete('/:reviewId',checkAuth, validateObjectId('reviewId'),deleteReview)

export default router;
