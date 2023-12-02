import { NextFunction, Request, Response } from 'express'
import zod, { ZodError, z } from 'zod'

import ApiError from '../errors/ApiError'

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const isUpdated = req.method === 'PUT'
  const schema = zod.object({
    firstName: isUpdated ? z.string().min(3).max(30).optional() : z.string().min(3).max(30),
    lastName: isUpdated ? z.string().min(3).max(30).optional() : z.string().min(3).max(30),
    password: isUpdated ? z.string().min(8).max(100).optional() : z.string().min(8).max(100),
    email: isUpdated ? z.string().email().optional() : z.string().email(),
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
