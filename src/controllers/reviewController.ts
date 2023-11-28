import { NextFunction, Request, Response } from 'express'

import { findAllReviews } from '../services/reviewService'
import ApiError from '../errors/ApiError'

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await findAllReviews()
    res.status(200).json({ message: 'All reviews returned successfully', payload: reviews })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
