import zod, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validateCategory(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    categoryName: zod
      .string()
      .min(3, { message: 'Category name is required' })
      .max(30, { message: 'Category name must be 30 characters or less' }),
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
