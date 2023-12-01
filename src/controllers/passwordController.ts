import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError'
import asyncHandler from 'express-async-handler'
import { User } from '../models/userModel'
import { generateActivationToken } from '../utils/sendEmail'
import bcrypt from 'bcrypt'
import { checkIfUserExistsByEmail } from '../services/authService'
import { sendResetPasswordEmail } from '../helpers/emailHelpers'
import { findAUser } from '../services/userService'

/**-----------------------------------------------
 * @desc    Send Reset Password Link
 * @route   /api/reset-password
 * @method  POST
 * @access  public
 ------------------------------------------------*/
export const sendResetPasswordLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    const user = await checkIfUserExistsByEmail(email)
    const resetToken = generateActivationToken()
    user.resetPasswordToken = resetToken

    await user.save()
    const resetLink = `http://localhost:5050/api/reset-password/${user._id}/${resetToken}`
    await sendResetPasswordEmail(user.email, resetLink)
    res.json({ message: 'Password reset link has been sent successfully' })
  }
)

/**-----------------------------------------------
 * @desc    Get Reset Password Link
 * @route   /api/reset-password/:userId/:token
 * @method  GET
 * @access  private
 ------------------------------------------------*/
export const getResetPasswordLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, token } = req.params
    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
    })

    if (!user) {
      return next(ApiError.badRequest('Invalid token'))
    }
    res.status(200).json({ message: 'Password reset is allowed with the valid token' })
  }
)

/**-----------------------------------------------
 * @desc    Reset Password
 * @route   /api/reset-password/:userId/:token
 * @method  POST
 * @access  private
 ------------------------------------------------*/
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, token } = req.params
    const { password } = req.body
    const user = await findAUser(userId)
    if (!user) {
      return next(ApiError.notFound('User not found'))
    }
    if (user.resetPasswordToken !== token) {
      return next(ApiError.badRequest('Invalid token'))
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: undefined,
        },
      }
    )
    res.status(200).json({
      message: 'Password has been reset successfully',
    })
  }
)
