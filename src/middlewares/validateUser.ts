import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'
import ApiError from '../errors/ApiError'

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    firstName: zod
      .string()
      .min(3, { message: 'First name is required' })
      .max(30, { message: 'First name must be 30 characters or less' }),
    lastName: zod
      .string()
      .min(3, { message: 'Last name is required' })
      .max(30, { message: 'Last name must be 30 characters or less' }),
    email: zod.string().email({ message: 'Invalid email address' }),
    password: zod
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(100, { message: 'Password must be 100 characters or less' }),
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
