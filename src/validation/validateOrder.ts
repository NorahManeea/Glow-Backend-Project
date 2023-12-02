import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'

import ApiError from '../errors/ApiError'

export function validateOrder(req: Request, res: Response, next: NextFunction) {
  const orderSchema = zod.object({
    orderDate: zod
      .date()
      .default(() => new Date())
      .optional(),
    shippingInfo: zod.object({
      country: zod.string(),
      city: zod.string(),
      address: zod.string(),
    }),
    orderStatus: zod.enum(['PENDING', 'PROCESSING', 'SHIPPED']).optional(),
  })

  try {
    orderSchema.parse(req.body)
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
