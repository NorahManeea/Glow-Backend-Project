import bcrypt from 'bcrypt'
import { User } from '../models/userModel'
import { UserDocument } from '../types/types'
import ApiError from '../errors/ApiError'
import { NextFunction } from 'express'


// @service:- Find All User
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
// @service:- Find a User
export const findAUser = async (userId: string) => {
  const user = await User.findById(userId)
  return user
}
// @service:- Remove a User
export const removeUser = async (userId: string, next: NextFunction) => {
  const user = await User.findByIdAndDelete(userId)
  return user
}
// @service:- Update User
export const updateUser = async (
  userId: string,
  updatedUser: UserDocument,
  avatar?: Express.Multer.File
) => {
  const { password } = updatedUser

  let user = await User.findByIdAndUpdate(userId, updatedUser, { new: true })
  if (!user) {
    throw ApiError.notFound('User not found with the entered ID')
  }

  if (password !== undefined) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
  }
  if (avatar) {
    user.avatar = avatar.path
  }

  return await user.save()
}
// @service:- Count Users
export const userCount = async () => {
  let usersCount = await User.countDocuments()
  return usersCount
}
// @service:- Block a User
export const blockUser = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    throw ApiError.notFound('User not found with the entered ID')
  }
  user.isBlocked = true
  return await user.save()
}
