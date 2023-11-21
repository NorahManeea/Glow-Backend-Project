// userController.ts
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { firstName, lastName, email, password } = req.body
    if (firstName !== undefined) {
      user.firstName = firstName
    }
    if (lastName !== undefined) {
      user.lastName = lastName
    }
    if (email !== undefined) {
      user.email = email
    }
    if (password !== undefined) {
      // Hash Pasword
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(req.body.password, salt)
    }

    await user.save()

    res.status(200).json({
      message: 'User updated successfully',
      updatedUser: user,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json({
      message: 'User has been deleted successfully',
      userId: user._id,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
