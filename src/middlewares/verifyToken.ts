import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { authConfig } from '../config/auth.config'
import { DecodedUser, Role } from '../types/types'
import ApiError from '../errors/ApiError'


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
    console.error('Token verification error:', error)
    return next(ApiError.forbidden('Invalid token'))
  }
}

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
