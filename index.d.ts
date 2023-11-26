declare namespace Express {
  interface Request {
    msg: string
    user: {
      firstName: string
      lastName: string
      email: string
      password: string
      role: 'user' | 'admin'
    }
  }
}
