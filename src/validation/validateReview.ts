import zod, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

const productSchema = zod.object({
  product: zod.string(),
})

export function validateReview(req: Request, res: Response, next: NextFunction) {
  const reviewSchema = zod.object({
    userId: zod.string(),
    content: zod.string().max(250, { message: 'Review content must be 250 characters or less' }),
    ReviewDate: zod.date().default(() => new Date()),
    products: zod.array(productSchema),
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
