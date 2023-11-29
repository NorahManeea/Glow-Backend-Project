import { Category } from '../models/categoryModel'
import { CategoryDocument } from '../types/types'
import ApiError from '../errors/ApiError'

export const findAllCategories = async (pageNumber = 1, limit = 8, searchText = '') => {
  const categoryCount = await Category.countDocuments()
  const totalPages = Math.ceil(categoryCount / limit)

  if (pageNumber > totalPages) {
    pageNumber = totalPages
  }
  const skip = (pageNumber - 1) * limit

  const categories = await Category.find()
    .skip(skip)
    .limit(limit)
    .find(searchText ? { categoryName: { $regex: searchText, $options: 'i' } } : {})

  if (categories.length == 0) {
    throw ApiError.notFound('There are no categories')
  }

  return { categories, totalPages, currentPage: pageNumber }
}

export const findCategory = async (categoryId: string) => {
  const category = await Category.findById(categoryId)
  if (!category) {
    throw ApiError.notFound(`Category not found with ID: ${categoryId}`)
  }

  return category
}

export const updateCategory = async (categoryId: string, updatedCategory: CategoryDocument) => {
  const categoryExist = await Category.exists({ categoryName: updatedCategory.categoryName })
  if (categoryExist) {
    throw ApiError.conflict(`Category already exists with name: ${updatedCategory.categoryName}`)
  }

  const category = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true })
  if (!category) {
    throw ApiError.notFound(`Category not found with ID: ${categoryId}`)
  }

  return category
}

export const removeCategory = async (categoryId: string) => {
  const category = await Category.findByIdAndDelete(categoryId)
  if (!category) {
    throw ApiError.notFound(`Category not found with ID: ${categoryId}`)
  }

  return category
}

export const createNewCategory = async (newCategory: CategoryDocument) => {
  const categoryExist = await Category.exists({ categoryName: newCategory.categoryName })
  if (categoryExist) {
    throw ApiError.conflict(`Category already exists with name: ${newCategory.categoryName}`)
  }

  const category = await Category.create({
    ...newCategory,
  })

  return category
}
