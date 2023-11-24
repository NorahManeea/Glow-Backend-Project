import { User } from '../models/userModel'
import createHttpError from 'http-errors'
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
  const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true })
  if (!user) {
    const error = createHttpError(404, 'User not found with the entered ID')
    throw error
  }
  return user
}

export const userCount = async () => {
  let usersCount = await User.countDocuments()
  return usersCount
}
