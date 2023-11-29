import express from 'express'

const router = express.Router()
import { addReview, deleteReview } from '../controllers/reviewController'
import { getAllReviews } from '../controllers/reviewController'

router.get('/', getAllReviews)
router.post('/', addReview)
router.delete('/:reveiwId', deleteReview)

export default router;
