import createHttpError from 'http-errors'

import { Category } from '../models/categoryModel'
import { CategoryDocument } from '../types/types'
import ApiError from '../errors/ApiError'

export const findAllCategories = async () => {
  const categories = await Category.find()
  return categories
}

export const findCategory = async (categoryId: string) => {
  const category = await Category.findById(categoryId)
  if (!category) {
    throw ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

export const updateCategory = async (categoryId: string, updatedCategory: CategoryDocument) => {
  const { categoryName } = updatedCategory
  const categoryExist = await Category.exists({ categoryName: categoryName })
  if (categoryExist) {
    throw ApiError.conflict(`Category already exists with this ${categoryName}`)
  }
  const category = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true })
  if (!category) {
    throw ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

export const removeCategory = async (categoryId: string) => {
  const category = await Category.findByIdAndDelete(categoryId)
  if (!category) {
    throw ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

export const createNewCategory = async (newCategory: CategoryDocument) => {
  const { categoryName } = newCategory
  const categoryExist = await Category.exists({ categoryName: categoryName })
  if (categoryExist) {
    throw ApiError.conflict(`Category already exists with this ${categoryName}`)
  }
  const category = await Category.create({
    ...newCategory,
  })
  return category
}
