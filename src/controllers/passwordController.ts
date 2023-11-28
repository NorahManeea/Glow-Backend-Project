import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError'
import { User } from '../models/userModel'
import { generateActivationToken, sendEmail } from '../utils/sendEmail'
import bcrypt from 'bcrypt'

/**-----------------------------------------------
 * @desc    Send Reset Password Link
 * @route   /api/reset-password
 * @method  POST
 * @access  public
 ------------------------------------------------*/
export async function sendResetPasswordLink(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return ApiError.notFound('User not found')
    }
    const resetToken = generateActivationToken()
    user.resetPasswordToken = resetToken

    await user.save()

    const subject = 'Reset Your Password'
    const resetLink = `http://localhost:5050/api/reset-password/${user._id}/${resetToken}`
    const htmlTemplate = `
  <p>Click the following button to reset your password:</p>
  <a href="${resetLink}">
    <button style="display: inline-block; padding: 10px 20px; background-color: #664971; color: #FFFFFF; font-size: 18px; text-decoration: none; border-radius: 5px;">
      Reset Password
    </button>
  </a>
`
    await sendEmail(user.email, subject, htmlTemplate)

    res.json({ message: 'Password reset link has been sent successfully' })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc    Get Reset Password Link
 * @route   /api/reset-password/:userId/:token
 * @method  GET
 * @access  private
 ------------------------------------------------*/
export async function getResetPasswordLink(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, token } = req.params

    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
    })

    if (!user) {
      return ApiError.badRequest('Invalid token')
    }
    res.json({ message: 'Password reset can proceed with the valid token' })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
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
    const user = await User.findById(userId)
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
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
