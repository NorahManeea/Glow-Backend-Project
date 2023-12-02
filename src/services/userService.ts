import { NextFunction } from 'express'

import { User } from '../models/userModel'
import { UserDocument } from '../types/types'
import ApiError from '../errors/ApiError'
import { calculatePagination } from '../utils/paginationUtils'
import { findBySearchQuery } from '../utils/searchUtils'

//** Service:- Find All Users */
export const findAllUser = async (pageNumber = 1, limit = 8, searchText = '') => {
  const userCount = await User.countDocuments()
  const { currentPage, skip, totalPages } = calculatePagination(userCount, pageNumber, limit)

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .find(findBySearchQuery(searchText, 'firstName'))
    .find(findBySearchQuery(searchText, 'lastName'))

  if (users.length === 0) {
    throw ApiError.notFound('There are no users')
  }

  return { users, totalPages, currentPage }
}

//** Service:- Find Single User */
export const findAUser = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    throw ApiError.notFound(`User not found with ID: ${userId}`)
  }

  return user
}

//** Service:- Remove a User */
export const removeUser = async (userId: string, next: NextFunction) => {
  const user = await User.findByIdAndDelete(userId)

  return user
}

//** Service:- Update a User */
export const updateUser = async (
  userId: string,
  updatedUser: UserDocument,
  avatar?: Express.Multer.File
) => {
  let user = await User.findByIdAndUpdate(userId, updatedUser, { new: true })
  if (!user) {
    throw ApiError.notFound(`User not found with ID: ${userId}`)
  }

  if (avatar) {
    user.avatar = avatar.path
  }

  return await user.save()
}

//** Service:- Count Users */
export const userCount = async () => {
  let usersCount = await User.countDocuments()

  return usersCount
}

//** Service:- Block a User */
export const blockUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(userId, { $set: { isBlocked: true } }, { new: true })
  if (!user) {
    throw ApiError.notFound(`User not found with ID: ${userId}`)
  }

  return user
}
