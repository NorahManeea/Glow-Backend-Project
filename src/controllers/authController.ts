import { Request, Response } from 'express'
import { User } from '../models/userModel'

import bcrypt from 'bcrypt'

/**
 * @desc Register User
 * @route /api/auth/register
 * @method POST
 * @access public
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password } = req.body

    // Check if email already registered
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'This email is already registered' })
    }

    // Hash Pasword
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    user = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashPassword,
    })
    const result = await user.save()
    res.status(201).json({
      message: 'You registered successfuly',
      result: result,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

/**
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
 */

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  return res.status(200).json({ message: 'Logged In successfully', user })
}
