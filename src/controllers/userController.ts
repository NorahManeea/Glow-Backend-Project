// userController.ts
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { User } from '../models/userModel'

/** -----------------------------------------------
 * @desc Get All User
 * @route /api/users/
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

/** -----------------------------------------------
 * @desc Get User Count
 * @route /api/users/count
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getUsersCount = async (req: Request, res: Response) => {
  let usersCount = await User.countDocuments()
  res.status(200).json(usersCount)
}

/** -----------------------------------------------
 * @desc Update user profile
 * @route /api/users/:userId
 * @method PUT
 * @access private (User himself)
  -----------------------------------------------*/
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: `no order with id: ${userId}` })
    }

    let updatedUser;
    const { firstName, lastName, email, password } = req.body
    if (firstName !== undefined) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { firstName: firstName } },
        { new: true }
      )
    }
    if (lastName !== undefined) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { lastName: lastName } },
        { new: true }
      )
    }
    if (email !== undefined) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { email: email } },
        { new: true }
      )
    }
    if (password !== undefined) {
      // Hash Pasword
      const salt = await bcrypt.genSalt(10)
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { password: await bcrypt.hash(req.body.password, salt) } },
        { new: true }
      )
    }

    res.status(200).json({
      message: 'User updated successfully',
      updatedUser: updatedUser,
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

/** -----------------------------------------------
 * @desc Delete user by ID
 * @route /api/users/:id
 * @method DELETE
 * @access private (Admin Only)
  -----------------------------------------------*/
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

/** -----------------------------------------------
 * @desc get all user
 * @route /api/users/
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId

    const user = await User.findById(userId)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server Error' })
  }
}
