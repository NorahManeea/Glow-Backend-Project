import express from 'express'

const router = express.Router()

import { getAllReviews } from '../controllers/reviewController'

router.get('/', getAllReviews)
