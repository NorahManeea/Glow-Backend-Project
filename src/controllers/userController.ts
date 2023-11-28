import { NextFunction, Request, Response } from 'express'

import {
  blockUser,
  findAUser,
  findAllUser,
  removeUser,
  updateUser,
  userCount,
} from '../services/userService'
import ApiError from '../errors/ApiError'

/** -----------------------------------------------
 * @desc Get All User
 * @route /api/users/
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await findAllUser()
    res.status(200).json({ message: 'All users returned successfully', payload: users })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Get User Count
 * @route /api/users/count
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getUsersCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersCount = await userCount()
    res.status(200).json({ meassge: 'Users Count', usersCount })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Update user profile
 * @route /api/users/:userId
 * @method PUT
 * @access private (User himself)
  -----------------------------------------------*/
export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const avatar = req.file
    const user = await updateUser(req.params.userId, req.body, avatar)
    res.status(200).json({
      message: 'User has been updated successfully',
      payload: user,
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Delete user by ID
 * @route /api/users/:id
 * @method DELETE
 * @access private (Admin Only)
  -----------------------------------------------*/
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await removeUser(req.params.userId)
    res.status(200).json({
      message: 'User has been deleted successfully',
      payload: user,
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc get user by Id
 * @route /api/users/:id
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findAUser(req.params.userId)
    res.status(200).json({ message: 'Single user returned successfully', payload: user })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Block User
 * @route /api/users/block/:id
 * @method PUT
 * @access private (Admin Only)
  -----------------------------------------------*/
export const blockUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await blockUser(req.params.userId)
    res.status(200).json({ message: 'User has been block successfully', payload: user })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
