import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import ApiError from '../errors/ApiError'
import { authConfig } from '../config/auth.config'
import { generateActivationToken } from '../utils/sendEmail'
import { User } from '../models/userModel'
import { activate, checkIfUserExistsByEmail } from '../services/authService'
import { sendActivationEmail } from '../helpers/sendActivationEmail'

/** -----------------------------------------------
 * @desc Register User
 * @route /api/auth/register
 * @method POST
 * @access public
  -----------------------------------------------*/
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, firstName, lastName, password } = req.body
    const avatar = req.file?.path
    let user = await checkIfUserExistsByEmail(email)
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

    const activationLink = `http://localhost:5050/api/auth/activate/${activationToken}`
    const isSent = await sendActivationEmail(email, activationLink)
    isSent && (await newUser.save())

    res.status(201).json({
      message: 'Registration successful. Check your email to activate your account',
    })
  } catch (error) {
    if (error instanceof ApiError) return next(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Activate User 
 * @route /api/auth/activate/:token
 * @method GET
 * @access private
  -----------------------------------------------*/
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activationToken = req.params.token
    const user = await activate(activationToken)
    if (!user) {
      return next(ApiError.badRequest('Invalid token'))
    }
    res.status(200).json({
      message: 'Your Account has been activated successfull',
    })
  } catch (error) {
    if (error instanceof ApiError) return next(error)
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
    const user = await checkIfUserExistsByEmail(email)
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
        expiresIn: '24h',
      }
    )
    res.status(200).json({ message: 'Login successful', token })
  } catch (error) {
    if (error instanceof ApiError) return next(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}
