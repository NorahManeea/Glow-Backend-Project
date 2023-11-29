import { NextFunction, Request, Response } from 'express'
import { findAllReviews } from '../services/reviewService'
import ApiError from '../errors/ApiError'
import { Review } from '../models/reviewModel'
import { Product } from '../models/productModel'

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
    next(ApiError.badRequest('Something went wrong'))
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

    if (!productId || !reviewText) {
      return next(ApiError.badRequest('ProductId and review text are required.'))
    }
    const productFound = await Product.findOne({
      productId,
    })
    if (!productFound) {
      return next(ApiError.notFound('ProductId not found'))
    }
    const review = new Review({
      userId,
      productId,
      reviewText,
    })
    await review.save()
    res.status(201).json({ message: 'Review added successfully', payload: review })
  } catch (error) {
    console.log(error)
    next(ApiError.badRequest('Something went wrong'))
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
    console.log(reviewId)

    if (!reviewId) {
      return next(ApiError.badRequest('Review ID is missing'))
    }

    const review = await Review.findByIdAndDelete(reviewId)

    if (!review) {
      return next(ApiError.notFound('Review not found'))
    }

    res.status(201).json({ message: 'Review has been deleted successfully', payload: review })
  } catch (error) {
    console.log(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}
