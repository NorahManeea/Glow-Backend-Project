import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'

import ApiError from '../errors/ApiError'

export function validateProduct(req: Request, res: Response, next: NextFunction) {
  const isUpdated = req.method === 'PUT'
  const schema = zod.object({
    name: isUpdated ? zod.string().min(3).max(100).optional() : zod.string().min(3).max(100),
    description: isUpdated
      ? zod
          .string()
          .min(10, { message: 'Product description must at least 3 characters' })
          .max(500, { message: 'Product description must be 100 characters or less' })
          .optional()
      : zod
          .string()
          .min(10, { message: 'Product description must at least 3 characters' })
          .max(100, { message: 'Product description must be 100 characters or less' }),
          image: zod.string().min(1, { message: 'Product image is required' }).optional(),
    quantityInStock: isUpdated
      ? zod
          .number()
          .nonnegative({ message: 'Quantity in stock must be nonnegative number' })
          .optional()
      : zod.number().nonnegative({ message: 'Quantity in stock must be nonnegative number' }),
      price: isUpdated
      ? zod.number().nonnegative({ message: 'Product price must be nonnegative number' }).optional()
      : zod.number().nonnegative({ message: 'Product price must be nonnegative number' }),
      categories: isUpdated
      ? zod.array(zod.string()).min(1, { message: 'Please enter at least one category' }).optional()
      : zod.array(zod.string()).min(1, { message: 'Please enter at least one category' }),
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
