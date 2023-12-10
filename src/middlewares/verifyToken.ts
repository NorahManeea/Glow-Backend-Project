import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '../config/auth.config'
import { DecodedUser, Role } from '../types/types'
import ApiError from '../errors/ApiError'
import { findReviewById } from '../services/reviewService'

//** User Verification  */
export function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return next(ApiError.forbidden('Token is missing'))
  }
  try {
    const decodedUser = jwt.verify(token, authConfig.jwt.accessToken) as DecodedUser
    req.decodedUser = decodedUser
    return next()
  } catch (error) {
    next(ApiError.forbidden('Invalid token'))
  }
}
//** Check User Role  */
export function checkRole(expectedRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const decodedUser = req.decodedUser
    if (decodedUser.role !== expectedRole) {
      next(ApiError.forbidden('NOT ALLOWED'))
      return
    }
    next()
  }
}
//** Check If User Blocked  */
export function checkBlock(req: Request, res: Response, next: NextFunction) {
  const decodedUser = req.decodedUser
  if (decodedUser.isBlocked) {
    return next(ApiError.forbidden('User is blocked'))
  }
  next()
}

//** Check User Ownership  */
export function checkOwnership(req: Request, res: Response, next: NextFunction) {
  const userId = req.decodedUser.userId
  if (userId === req.params.userId) {
    return next()
  }
  return next(ApiError.forbidden('You are not authorized'))
}


//** Check User Ownership  */
type Resource = 'review' | 'users'
export function checkOwnershipByParams(resource: Resource) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resources: Record<string, any> = {
      review: async () => {
        const { reviewId } = req.params
        return {
          paramsId: reviewId,
          resource: await findReviewById(reviewId),
        }
      },
    }

    const resourceUser = await resources[resource]
    if (
      req.decodedUser.role !== 'ADMIN' ||
      req.decodedUser.userId !== resourceUser.resource.userId
    ) {
      return next(ApiError.forbidden('You are not authorized to delete this review'))
    }
    
  }
}

