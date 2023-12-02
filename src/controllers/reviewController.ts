import { NextFunction, Request, Response } from 'express'
import { createNewReview, findAllReviews, removeReview } from '../services/reviewService'
import { Review } from '../models/reviewModel'
import { findProduct } from '../services/productService'

/** -----------------------------------------------
 * @desc Get All Reviews
 * @route /api/reviews/
 * @method GET
 * @access puplic
  -----------------------------------------------*/
export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await findAllReviews()
    res.status(200).json({ message: 'All reviews returned successfully', payload: reviews })
  } catch (error) {
    next(error)
  }
}

/** -----------------------------------------------
 * @desc Add Review
 * @route /api/reviews/
 * @method POST
 * @access private (logged in user)
  -----------------------------------------------*/
export const addNewReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error)
  }
}

/** -----------------------------------------------
 * @desc Delete Review
 * @route /api/reviews/:reviewId
 * @method DELETE
 * @access private (Admin or logged in user)
  -----------------------------------------------*/
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params
    const review = await removeReview(reviewId)
    res.status(201).json({ message: 'Review has been deleted successfully', payload: review })
  } catch (error) {
    next(error)
  }
}
