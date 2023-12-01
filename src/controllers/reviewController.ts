import { NextFunction, Request, Response } from 'express'
import { createNewReview, findAllReviews, removeReview } from '../services/reviewService'
import asyncHandler from 'express-async-handler'
import { Review } from '../models/reviewModel'
import { findProduct } from '../services/productService'

/** -----------------------------------------------
 * @desc Get All Reviews
 * @route /api/reviews/
 * @method GET
 * @access puplic
  -----------------------------------------------*/
export const getAllReviews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await findAllReviews()
    res.status(200).json({ message: 'All reviews returned successfully', payload: reviews })
  }
)

/** -----------------------------------------------
 * @desc Add Review
 * @route /api/reviews/
 * @method POST
 * @access private (logged in user)
  -----------------------------------------------*/
export const addNewReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, reviewText } = req.body
    const { userId } = req.decodedUser
    await findProduct(userId)
    const review = new Review({
      userId,
      productId,
      reviewText,
    })
    await createNewReview(review)
    res.status(201).json({ message: 'Review added successfully', payload: review })
  }
)

/** -----------------------------------------------
 * @desc Delete Review
 * @route /api/reviews/:reviewId
 * @method DELETE
 * @access private (Admin or logged in user)
  -----------------------------------------------*/
export const deleteReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params
    const review = await removeReview(reviewId)
    res.status(201).json({ message: 'Review has been deleted successfully', payload: review })
  }
)
