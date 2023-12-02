import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'

import ApiError from '../errors/ApiError'

export function validateProduct(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    productName: zod
      .string()
      .min(3, { message: 'Product name must at least 3 characters' })
      .max(100, { message: 'Product name must be 100 characters or less' }),
    productDescription: zod
      .string()
      .min(10, { message: 'Product description must at least 3 characters' })
      .max(100, { message: 'Product description must be 100 characters or less' }),
    productImage: zod.string().min(1, { message: 'Product image is required' }),
    quantityInStock: zod
      .number()
      .nonnegative({ message: 'Quantity in stock must be nonnegative number' }),
    productPrice: zod.number().nonnegative({ message: 'Product price must be nonnegative number' }),
    category: zod.array(zod.string()).min(1, { message: 'Please enter at least one category' }),
  })

  try {
    schema.parse(req.body)
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
