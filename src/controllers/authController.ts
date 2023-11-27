import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import ApiError from '../errors/ApiError'
import { authConfig } from '../config/auth.config'
import { generateActivationToken, sendEmail } from '../utils/sendEmail'
import { User } from '../models/userModel'

/** -----------------------------------------------
 * @desc Register User
 * @route /api/auth/register
 * @method POST
 * @access public
  -----------------------------------------------*/
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, firstName, lastName, password, role } = req.body
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'This email is already registered' })
    }
    const token = generateActivationToken()
    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashPassword,
      token,
      role: 'USER',
    })

    await newUser.save()
    const activationLink = `http://localhost:5050/api/auth/activate/${token}`

    const subject = 'Welcome to Black Tigers Team!'
    const htmlTemplate = `
        <div style="color: #333; text-align: center;">
          <h1 style="color: #1E1E1E;">Welcome to Black Tigers Team!</h1>
          <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #664971; color: #FFFFFF; font-size: 18px; text-decoration: none; border-radius: 5px;">Activate Now</a>
          <p style="font-size: 14px; color: #302B2E;">Black Tigers Team</p>
        </div>
      `
    await sendEmail(email, subject, htmlTemplate)

    res.status(201).json({
      message: 'Registration successful. Check your email to activate your account',
      newUser,
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Create User 
 * @route /api/auth/activate/:token
 * @method GET
 * @access private
  -----------------------------------------------*/
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activationToken = req.params.token
    const user = await User.findOneAndUpdate(
      { token: activationToken },
      { isAccountVerified: true, token: undefined },
      { new: true }
    )
    if (!user) {
      next(ApiError.badRequest('Invalid token'))
      return
    }
    res.status(200).json({
      message: 'Your Account has been activated successfull',
    })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

/** -----------------------------------------------
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
  -----------------------------------------------*/
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }
  const user = await User.findOne({ email: email })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    return res.status(400).json({ message: 'The email or password you entered is invalid' })
  }

  const token = jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    authConfig.jwt.accessToken as string,
    {
      expiresIn: '24h',
    }
  )
  res.status(200).json({ message: 'Login successful', token })
}
