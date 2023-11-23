import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'
import ApiError from '../errors/ApiError'

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
   
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
