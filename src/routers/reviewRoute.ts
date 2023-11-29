import express from 'express'

const router = express.Router()
import { addNewReview, deleteReview,getAllReviews } from '../controllers/reviewController'
import { checkAuth } from '../middlewares/verifyToken'

router.get('/', getAllReviews)
router.post('/', checkAuth,addNewReview)
router.delete('/:reviewId', deleteReview)

export default router;
