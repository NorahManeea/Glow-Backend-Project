import { Category } from '../models/categoryModel'
import { CategoryDocument } from '../types/types'
import ApiError from '../errors/ApiError'
import { calculatePagination } from '../utils/paginationUtils'
import { findBySearchQuery } from '../utils/searchUtils'

//** Service:- Find All Categories */
export const findAllCategories = async (pageNumber = 1, limit = 8, searchText = '') => {
  const categoryCount = await Category.countDocuments()
  const { currentPage, skip, totalPages } = calculatePagination(categoryCount, pageNumber, limit)
  const categories = await Category.find()
    .skip(skip)
    .limit(limit)
    .find(findBySearchQuery(searchText, 'name'))
  if (categories.length === 0) {
    throw ApiError.notFound('There are no categories')
  }

  return { categories, totalPages, currentPage }
}

//** Service:- Find a Category */
export const findCategory = async (categoryId: string) => {
  const category = await Category.findById(categoryId)
  if (!category) {
    throw ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

//** Service:- Update a Category */
export const updateCategory = async (categoryId: string, updatedCategory: CategoryDocument) => {
  const { name } = updatedCategory
  const categoryExist = await Category.exists({ name: name })
  if (categoryExist) {
    throw ApiError.alreadyExist(`Category already exists with this ${name}`)
  }
  const category = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true })
  if (!category) {
    throw ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

//** Service:- Remove a Category */
export const removeCategory = async (categoryId: string) => {
  const category = await Category.findByIdAndDelete(categoryId)
  if (!category) {
    throw ApiError.notFound(`Category not found with the ID: ${categoryId}`)
  }
  return category
}

//** Service:- Create a Category  */
export const createNewCategory = async (newCategory: CategoryDocument) => {
  const { name } = newCategory
  const categoryExist = await Category.exists({ name: name })
  if (categoryExist) {
    throw ApiError.alreadyExist(`Category already exists with this ${name}`)
  }
  const category = new Category(newCategory)
  await category.save()
  return category
}
