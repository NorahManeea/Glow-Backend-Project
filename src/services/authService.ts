import ApiError from '../errors/ApiError'
import { User } from '../models/userModel'
import { UserDocument } from '../types/types'
import bcrypt from 'bcrypt'

//** Service:- Check User email */
export const checkIfUserExistsByEmail = async (email: string) => {
  const userEmail = await User.findOne({ email })
  if (!userEmail) {
    throw ApiError.notFound('No user found with the provided email address')
  }
  return userEmail
}

//** Service:- Activate a User */
export const activate = async (activationToken: string) => {
  const user = await User.findOneAndUpdate(
    { activationToken },
    { isAccountVerified: true, token: undefined },
    { new: true }
  )
  return user
}

//** Service:- Create a User */
export const createUser = async (user: UserDocument) => {
  const newUser = await User.create({ user })
  return newUser.save()
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

  return user
}
