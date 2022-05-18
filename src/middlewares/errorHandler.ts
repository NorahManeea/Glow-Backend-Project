import { Request, Response, NextFunction } from 'express'

function errorHandler404(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    status: 404,
    message: 'Page Not Found',
  })
}

function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(400).json({
    status: 400,
    message: 'Something wrong',
  })
}

export default { globalErrorHandler, errorHandler404 }
