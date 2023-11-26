import { Request, Response } from 'express'
import { User } from '../models/userModel'

import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'

import bcrypt from 'bcrypt'
import { authConfig } from '../config/auth.config'
import { sendEmail } from '../utils/sendEmail'

/** -----------------------------------------------
 * @desc Register User
 * @route /api/auth/register
 * @method POST
 * @access public
  -----------------------------------------------*/
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password } = req.body
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'This email is already registered' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const tokenPayload = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashPassword,
    }
    const token = jwt.sign(tokenPayload, authConfig.jwt.accessToken, {expiresIn: '10m'})

    const subject = 'Welcome to Black Tigers Team!'
    const htmlTemplate = `
    <div style="color: #333; text-align: center;">
      <h1 style="color: #1E1E1E;">Welcome to Black Tigers Team!</h1>
      <a href="http://localhost:5050/api/auth/activate/${token}" style="display: inline-block; padding: 10px 20px; background-color: #664971; color: #FFFFFF; font-size: 18px; text-decoration: none; border-radius: 5px;">Activate Now</a>
      <p style="font-size: 14px; color: #302B2E;">Black Tigers Team</p>
    </div>
    `
    await sendEmail(email, subject, htmlTemplate)

    res.status(201).json({
      message: 'Registration successful. Check your email to activate your account',
      token: token,
    })
  } catch (error) {
    console.error(error)
    if(error instanceof TokenExpiredError){
      return res.status(401).json({ error: 'Token has expired' });
    } else{
      res.status(500).json({ error: error })
    }
  }
}

/** -----------------------------------------------
 * @desc Create User 
 * @route /api/auth/activate/:token
 * @method GET
 * @access private
  -----------------------------------------------*/
export const createrUser = async (req: Request, res: Response) => {
  try {
    const token = req.params.token

    const verifiedToken = jwt.verify(token, authConfig.jwt.accessToken) as JwtPayload

    if (!verifiedToken) {
      return res.status(400).json({ message: 'Invalid token' })
    }
    const { email, firstName, lastName, password } = verifiedToken
    const user = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      token
    })

    await user.save()
    res.status(200).json({ message: 'Your Account has been activated successfully' })
  } catch (error) {
    console.error(error)
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
  res.status(200).json({
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  })
}
