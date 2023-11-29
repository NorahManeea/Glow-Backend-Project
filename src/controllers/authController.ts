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
    const { email, firstName, lastName, password } = req.body
    const avatar = req.file?.path || ''
    let user = await User.findOne({ email })
    if (user) {
      return next(ApiError.badRequest('This email is already registered'))
    }
    const activationToken = generateActivationToken()
    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashPassword,
      activationToken,
      role: 'USER',
      avatar,
      isBlocked: false,
    })
    console.log(newUser)

    const activationLink = `http://localhost:5050/api/auth/activate/${activationToken}`

    const subject = 'Welcome to Black Tigers Team!'
    const htmlTemplate = `
        <div style="color: #333; text-align: center;">
          <h1 style="color: #1E1E1E;">Welcome to Black Tigers Team!</h1>
          <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #664971; color: #FFFFFF; font-size: 18px; text-decoration: none; border-radius: 5px;">Activate Now</a>
          <p style="font-size: 14px; color: #302B2E;">Black Tigers Team</p>
        </div>
      `
    const isSent = await sendEmail(email, subject, htmlTemplate)
    isSent && (await newUser.save())

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
    console.log(activationToken)
    const user = await User.findOneAndUpdate(
      { activationToken },
      { isAccountVerified: true, token: undefined },
      { new: true }
    )

    console.log(user)

    if (!user) {
      return next(ApiError.badRequest('Invalid token'))
    }
    res.status(200).json({
      message: 'Your Account has been activated successfull',
      user,
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
  -----------------------------------------------*/
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user || !user.isAccountVerified) {
      return next(ApiError.badRequest('Invalid email or account not activated'))
    }
    if (!user) {
      return next(ApiError.notFound('User not found'))
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return next(ApiError.badRequest('The email or password you entered is invalid'))
    }
    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
      authConfig.jwt.accessToken as string,
      {
        expiresIn: '10m',
      }
    )
    res.status(200).json({ message: 'Login successful', token })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
