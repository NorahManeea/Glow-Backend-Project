// userController.ts
import { Request, Response } from 'express'
import { findAUser, findAllUser, removeUser, updateUser, userCount } from '../services/userService'

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
    res.status(500).json({ error: error })
  }
}
/** -----------------------------------------------
 * @desc Get User Count
 * @route /api/users/count
 * @method GET
 * @access private (Admin Only)
  -----------------------------------------------*/
export const getUsersCount = async (req: Request, res: Response) => {
  try {
    const usersCount = await userCount()
  res.status(200).json({ meassge: 'Users Count', usersCount })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
/** -----------------------------------------------
 * @desc Update user profile
 * @route /api/users/:userId
 * @method PUT
 * @access private (User himself)
  -----------------------------------------------*/
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await updateUser(req.params.userId, req.body);
    res.status(200).json({
      message: 'User has been updated successfully',
      payload: user,
    });
  } catch (error) {
    res.status(500).json({ error: error })
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
    res.status(500).json({ error: error })
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
    res.status(500).json({ error: error })
  }
}
