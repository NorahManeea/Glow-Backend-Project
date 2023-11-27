import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'

import { User } from '../models/userModel'
import { UserDocument } from '../types/types'


export const findAllUser = async () => {
  const users = await User.find()
  return users
}

export const findAUser = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = createHttpError(404, 'User not found with the entered ID')
    throw error
  }
  return user
}

export const removeUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId)
  if (!user) {
    const error = createHttpError(404, 'User not found with the entered ID')
    throw error
  }
  return user
}

export const updateUser = async (userId: string, updatedUser: UserDocument) => {
  const { password } = updatedUser

  const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true })
  if (!user) {
    const error = createHttpError(404, 'User not found with the entered ID')
    throw error
  }

  if (password !== undefined) {
    // Hash Password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()
  }

  return user
}

export const userCount = async () => {
  let usersCount = await User.countDocuments()
  return usersCount
}

export const blockUser = async (userId: string) => {
  const isBlock = await User.findByIdAndUpdate(
    userId,
    { $set: { isBlocked: true} },
    { new: true }
  )
  return isBlock
}
