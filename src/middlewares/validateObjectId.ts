import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

//** Validate Mongo Object ID  */
export const validateObjectId =
  (paramName: string) => (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName]
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }
    next()
  }
