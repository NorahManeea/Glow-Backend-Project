// userController.ts
import { Request, Response } from 'express'
import { User } from '../models/userModel'

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
export const getUsersCount = async (req: Request, res: Response) => {
  let usersCount = await User.countDocuments()
  res.status(200).json(usersCount)
}
