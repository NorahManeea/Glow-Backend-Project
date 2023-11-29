import bcrypt from 'bcrypt'

import { User } from '../models/userModel'
import { UserDocument } from '../types/types'
import ApiError from '../errors/ApiError'

export const findAllUser = async (pageNumber = 1, limit = 8, searchText = '') => {
  const userCount = await User.countDocuments()
  const totalPages = Math.ceil(userCount / limit)

  if (pageNumber > totalPages) {
    pageNumber = totalPages
  }
  const skip = (pageNumber - 1) * limit

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .find(
      searchText
        ? {
            $or: [
              { firstName: { $regex: searchText, $options: 'i' } },
              { lastName: { $regex: searchText, $options: 'i' } },
            ],
          }
        : {}
    )

  return { users, totalPages, currentPage: pageNumber }
}

export const findAUser = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    return ApiError.notFound('User not found with the entered ID')
  }
  return user
}

export const removeUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId)
  if (!user) {
    return ApiError.notFound('User not found with the entered ID')
  }
  return user
}

export const updateUser = async (
  userId: string,
  updatedUser: UserDocument,
  avatar?: Express.Multer.File
) => {
  const { password } = updatedUser

  const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true })
  if (!user) {
    return ApiError.notFound('User not found with the entered ID')
  }

  if (password !== undefined) {
    // Hash Password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
  }
  if (avatar) {
    user.avatar = avatar.path
  }
  await user.save()

  return user
}

export const userCount = async () => {
  let usersCount = await User.countDocuments()
  return usersCount
}

export const blockUser = async (userId: string) => {
  console.log('teest')
  const isBlock = await User.findByIdAndUpdate(userId, { $set: { isBlocked: true } }, { new: true })
  return isBlock
}
