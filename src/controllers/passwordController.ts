import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import { generateActivationToken } from '../utils/sendEmailUtils'
import { sendResetPasswordEmail } from '../helpers/emailHelpers'
import { findAUser } from '../services/userService'
import { updatePassword, checkResetPasswordToken } from '../services/passwordService'
import { checkIfUserExistsByEmail } from '../services/authService'

/**-----------------------------------------------
 * @desc    Send Reset Password Link
 * @route   /api/reset-password
 * @method  POST
 * @access  public
 ------------------------------------------------*/
export const sendResetPasswordLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const user = await checkIfUserExistsByEmail(email)
    if (!user) {
      throw ApiError.notFound('No user found with the provided email address')
    }
    const resetToken = generateActivationToken()
    user.resetPasswordToken = resetToken

    await user.save()
    const resetLink = `http://localhost:5050/api/reset-password/${user._id}/${resetToken}`
    await sendResetPasswordEmail(user.email, resetLink)
    res.json({ message: 'Password reset link has been sent successfully' })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc    Get Reset Password Link
 * @route   /api/reset-password/:userId/:token
 * @method  GET
 * @access  private
 ------------------------------------------------*/
export const getResetPasswordLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token } = req.params
    await checkResetPasswordToken(userId, token)
    res.status(200).json({ message: 'Password reset is allowed with the valid token' })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc    Reset Password
 * @route   /api/reset-password/:userId/:token
 * @method  POST
 * @access  private
 ------------------------------------------------*/
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token } = req.params
    const { password } = req.body
    const user = await findAUser(userId)

    if (user.resetPasswordToken !== token) {
      return next(ApiError.badRequest('Invalid token'))
    }
    await updatePassword(userId, password)
    res.status(200).json({
      message: 'Password has been reset successfully',
    })
  } catch (error) {
    next(error)
  }
}
