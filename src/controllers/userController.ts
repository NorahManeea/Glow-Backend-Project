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
    let pageNumber = Number(req.query.pageNumber)
    const limit = Number(req.query.limit)
    const searchText = req.query.searchText?.toString()
    const { users, totalPages, currentPage } = await findAllUser(pageNumber, limit, searchText)
    res
      .status(200)
      .json({ message: 'All users returned successfully', payload: users, totalPages, currentPage })
  } catch (error) {
    next(error)
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
    res.status(200).json({ meassge: 'Users Count', payload: usersCount })
  } catch (error) {
    next(error)
  }
}

/** -----------------------------------------------
 * @desc Update user profile
 * @route /api/users/:userId
 * @method PUT
 * @access private (User himself Only)
  -----------------------------------------------*/
export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUser(req.params.userId, req.body, req.file)
    res.status(200).json({
      message: 'User has been updated successfully',
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

/** -----------------------------------------------
 * @desc Delete user by ID
 * @route /api/users/:id
 * @method DELETE
 * @access private (Admin and User himself Only)
  -----------------------------------------------*/
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await removeUser(req.params.userId, next)
    if (!user) {
      return next(ApiError.notFound('User not found with the entered ID'))
    }

    res.status(200).json({
      message: 'User has been deleted successfully',
      payload: user,
    })
  } catch (error) {
    next(error)
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
    next(error)
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
    const blockedUser = await blockUser(req.params.userId)

    res.status(200).json({
      message: 'User has been blocked successfully',
      payload: blockedUser,
    })
  } catch (error) {
    next(error)
  }
}
