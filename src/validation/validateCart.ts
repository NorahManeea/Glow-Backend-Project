import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'

import ApiError from '../errors/ApiError'

export function validateCart(req: Request, res: Response, next: NextFunction) {
  const productSchema = zod.object({
    product: zod
      .string()
      .min(3, { message: 'Product name must at least 3 characters' })
      .max(100, { message: 'Product name must be 100 characters or less' }),
    quantity: zod.number().nonnegative({ message: 'Quantity in stock must be nonnegative number' }),
  })

  const cartSchema = zod.object({
    user: zod.string().min(2, { message: 'User name must at least 3 characters' }),
    products: zod.array(productSchema),
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