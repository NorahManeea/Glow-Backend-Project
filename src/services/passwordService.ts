import ApiError from '../errors/ApiError'
import { User } from '../models/userModel'
import bcrypt from 'bcrypt'

//** Service:- Update Password  */
export const updatePassword = async (userId: string, password: string) => {
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
}

//** Service:- Reset Password  */
export const resetPassword = async (userId: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        password: hashedPassword,
        resetPasswordToken: undefined,
      },
    },
    { new: true }
  )
  if (!user) {
    throw ApiError.notFound('User not found with the entered ID')
  }
  user.resetPasswordToken = undefined
  return user
}

//** Service:- Check Reset Passord Token  */
export const checkResetPasswordToken = async (userId: string, token: string) => {
  const user = await User.findOne({
    _id: userId,
    resetPasswordToken: token,
  })

  if (!user) {
    throw ApiError.badRequest('Invalid token')
  }

  return user
}
