import { NextFunction, Request, Response } from 'express'
import fs from 'fs'

export default function myLogger(req: Request, res: Response, next: NextFunction) {
  const filePath = './src/logs/requests.txt'
  const currentDate = new Date()
  const date = currentDate.toLocaleDateString()
  const time = currentDate.toLocaleTimeString()

  const dataToWrite = `Method: ${req.method}, Path: ${req.path}, Date: ${date}, Time: ${time}\n`

  fs.appendFile(filePath, dataToWrite, (err) => {
    if (err) {
      return next(new Error('FAILED TO LOG REQUEST INFO'))
    }
  })

  next()
}
