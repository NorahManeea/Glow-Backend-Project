import { NextFunction, Request, Response } from 'express'
import { createNewReview, findAllReviews, removeReview } from '../services/reviewService'
import { Review } from '../models/reviewModel'
import { findProduct } from '../services/productService'
import ApiError from '../errors/ApiError'
import { findOrderHistory } from '../services/orderService'

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
 * @access private (only registered users)
  -----------------------------------------------*/
export const addNewReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, reviewText } = req.body
    // Check if the user has ordered the product
    const orderHistory = await findOrderHistory(req.decodedUser.userId)
    const orderedProductIds = orderHistory.map((order) =>
      order.products.map((product) => product.product.toString())
    )
    if (!orderedProductIds.includes(productId)) {
      return next(ApiError.badRequest('You can only review products that you have ordered.'))
    }

    const review = new Review({
      userId: req.decodedUser.userId,
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
 * @access private (Admin or user who wrote the review)
  -----------------------------------------------*/
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params
    const review = await removeReview(reviewId)
    if (req.decodedUser.role !== 'ADMIN' && req.decodedUser.userId !== review.userId) {
      return next(ApiError.forbidden('You are not authorized to delete this review'))
    }
    res.status(201).json({ message: 'Review has been deleted successfully', payload: review })
  } catch (error) {
    next(error)
  }
}
