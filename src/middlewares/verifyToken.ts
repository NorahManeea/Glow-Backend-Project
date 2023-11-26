import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { authConfig } from '../config/auth.config'
import { DecodedUser, Role } from '../types/types'
import ApiError from '../errors/ApiError'

export function checkAuth(expectedRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    console.log(token)
    if (token) {
      try {
        const decodedUser = jwt.verify(token, authConfig.jwt.accessToken) as DecodedUser
        console.log(decodedUser)
        console.log(decodedUser.iat)

        if (decodedUser.role !== expectedRole) {
          next(ApiError.forbidden('NOT ALLOWED'))
          return
        }

        req.decodedUser = decodedUser
        next()
      } catch (error) {
        next(ApiError.forbidden('invalid token'))
      }
      return
    }
    next(ApiError.forbidden('Token is required'))
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
