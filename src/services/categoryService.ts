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
    .find(
      searchText
        ? {
            $or: [
              { categoryName: { $regex: searchText, $options: 'i' } },
            ],
          }
        : {}
    )

  return { categories, totalPages, currentPage: pageNumber }
}

export const findCategory = async (categoryId: string) => {
  const category = await Category.findById(categoryId)
  if (!category) {
    return ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

export const updateCategory = async (categoryId: string, updatedCategory: CategoryDocument) => {
  const { categoryName } = updatedCategory
  const categoryExist = await Category.exists({ categoryName: categoryName })
  if (categoryExist) {
    throw ApiError.alreadyExist(`Category already exists with this ${categoryName}`)
  }
  const category = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true })
  if (!category) {
    return ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

export const removeCategory = async (categoryId: string) => {
  const category = await Category.findByIdAndDelete(categoryId)
  if (!category) {
    return ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

export const createNewCategory = async (newCategory: CategoryDocument) => {
  const { categoryName } = newCategory
  const categoryExist = await Category.exists({ categoryName: categoryName })
  if (categoryExist) {
    return ApiError.alreadyExist(`Category already exists with this ${categoryName}`)
  }
  const category = await Category.create({
    ...newCategory,
  })
  return category
}
