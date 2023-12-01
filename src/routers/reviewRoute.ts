import express from 'express'
import { addNewReview, deleteReview,getAllReviews } from '../controllers/reviewController'
import { checkAuth } from '../middlewares/verifyToken'

const router = express.Router()

router.get('/',getAllReviews)
router.post('/',checkAuth, checkAuth,addNewReview)
router.delete('/:reviewId',checkAuth, deleteReview)

export default router;
