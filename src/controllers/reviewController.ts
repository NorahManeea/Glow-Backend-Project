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
export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, content } = req.body
    if (!productId || !content) {
      return next(ApiError.badRequest('ProductId and content are required.'))
    }
    const productFound = await Product.findOne({
      productId,
    })
    if (!productFound) {
      return next(ApiError.notFound('ProductId not found'))
    }

    const review = new Review({
      productId,
      content,
    })
    await review.save()
    res.status(201).json({ message: 'Review added successfully', payload: review })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Delete Review
 * @route /api/reviews/:reviewID
 * @method DELETE
 * @access private (Admin orlogged in user)
  -----------------------------------------------*/
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reveiwId } = req.params

    const reveiw = await Review.findByIdAndDelete({ reveiwId })

    if (!reveiw) {
      return next(ApiError.notFound('ProductId not found'))
    }
    res.status(201).json({ message: 'Review added successfully', payload: reveiw })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
