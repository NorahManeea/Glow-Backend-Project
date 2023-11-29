import zod, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validateReview(req: Request, res: Response, next: NextFunction) {
  const reviewSchema = zod.object({
    userId: zod.string(),
    reviewText: zod.string().max(250, { message: 'Review text must be 250 characters or less' }),
    products: zod.string(),
  })

  try {
    reviewSchema.parse(req.body)
    next()
  } catch (error) {
    const err = error
    if (err instanceof ZodError) {
      next(ApiError.badRequestValidation(err.errors))
      return
    }

    next(ApiError.internal('Something went wrong'))
  }
}
