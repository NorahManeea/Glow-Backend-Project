// userController.ts
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { User } from '../models/userModel'
import { findAUser, findAllUser, removeUser, userCount } from '../services/userService'

/** -----------------------------------------------
 * @desc Get All User
 * @route /api/users/
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await findAllUser()
    res.status(200).json({ message: 'All users returned successfully', payload: users })
  } catch (error) {
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
  const usersCount = await userCount()
  res.status(200).json({ meassge: 'Users Count', usersCount })
}
/** -----------------------------------------------
 * @desc Update user profile
 * @route /api/users/:userId
 * @method PUT
 * @access private (User himself)
  -----------------------------------------------*/
export const updateUserById = async (req: Request, res: Response) => {
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
      payload: user,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
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
    const user = await removeUser(req.params.userId)
    res.status(200).json({
      message: 'User has been deleted successfully',
      payload: user,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
/** -----------------------------------------------
 * @desc get user by Id
 * @route /api/users/:id
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await findAUser(req.params.userId)
    res.status(200).json({ message: 'Single user returned successfully', payload: user })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
