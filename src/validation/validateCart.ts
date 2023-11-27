import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'

import ApiError from '../errors/ApiError'


export function validateCart(req: Request, res: Response, next: NextFunction) {


  const cartSchema = zod.object({
    quantity: zod
    .number()
    .nonnegative({ message: 'Quantity must be nonnegative number' }),
  })
  try {
    cartSchema.parse(req.body)
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