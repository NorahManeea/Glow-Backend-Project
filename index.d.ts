declare namespace Express {
  interface Request {
    validatedUser: {
      email: string
      password: string
    }
    decodedUser: {
      userId: string
      email: string
      role: 'USER' | 'ADMIN'
      isBlocked: boolean
      iat: number
      exp: number
    }
  }
}