
declare namespace Express {
  interface Request {
    msg: string
    user: {
      id: string
      email: string
      password:string
      role: 'user'| 'admin'
    }
  }
}
