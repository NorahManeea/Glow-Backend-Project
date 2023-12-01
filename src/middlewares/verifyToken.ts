import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '../config/auth.config'
import { DecodedUser, Role } from '../types/types'
import ApiError from '../errors/ApiError'

//** User Verification  */
export function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return next(ApiError.forbidden('Token is missing'))
  }
  try {
    const decodedUser = jwt.verify(token, authConfig.jwt.accessToken) as DecodedUser
    req.decodedUser = decodedUser
    console.log(decodedUser.userId)
    return next()
  } catch (error) {
    console.error('Token verification error:', error)
    return next(ApiError.forbidden('Invalid token'))
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
  const decodedUser = req.decodedUser;
  console.log(decodedUser)
  if (decodedUser.isBlocked) {
    return next(ApiError.forbidden('User is blocked'));
  }
  next();
}