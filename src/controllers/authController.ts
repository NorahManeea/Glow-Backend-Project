import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
import ApiError from '../errors/ApiError'

import { authConfig } from '../config/auth.config'
import { generateActivationToken } from '../utils/sendEmail'
import { User } from '../models/userModel'
import { activate, checkIfUserExistsByEmail, createUser } from '../services/authService'
import { sendActivationEmail } from '../helpers/emailHelpers'

/** -----------------------------------------------
 * @desc Register User
 * @route /api/auth/register
 * @method POST
 * @access public
  -----------------------------------------------*/
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, firstName, lastName, password } = req.body
    const avatar = req.file?.path
    await checkIfUserExistsByEmail(email)

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
    isSent && (await createUser(newUser))

    res.status(201).json({
      message: 'Registration successful. Check your email to activate your account',
    })
  }
)

/** -----------------------------------------------
 * @desc Activate User 
 * @route /api/auth/activate/:token
 * @method GET
 * @access private
  -----------------------------------------------*/
export const activateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const activationToken = req.params.token
    const user = await activate(activationToken)
    if (!user) {
      return next(ApiError.badRequest('Invalid token'))
    }
    res.status(200).json({
      message: 'Your Account has been activated successfull',
    })
  }
)

/** -----------------------------------------------
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
  -----------------------------------------------*/
export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const user = await checkIfUserExistsByEmail(email)
  if (!user.isAccountVerified) {
    return next(ApiError.badRequest('Invalid email or account not activated'))
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
})
