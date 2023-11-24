import { Category } from '../models/categoryModel'
import createHttpError from 'http-errors'
import { CategoryDocument } from '../types/types'

export const findAllCategories = async () => {
  const categories = await Category.find()
  return categories
}

export const findCategory = async (categoryId: string) => {
  const category = await Category.findById(categoryId)
  console.log(category)
  if (!category) {
    const error = createHttpError(404, 'Category not found with the entered ID')
    throw error
  }
  return category
}

export const updateCategory = async (categoryId: string, updatedCategory: CategoryDocument) => {
  const { categoryName } = updatedCategory
  const categoryExist = await Category.exists({ categoryName: categoryName })
  if (categoryExist) {
    const error = createHttpError(409, `Category already exists with this ${categoryName}`)
    throw error
  }
  const category = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true })
  if (!category) {
    const error = createHttpError(404, 'Category not found with the entered ID')
    throw error
  }
  return category
}
export const removeCategory = async (categoryId: string) => {
  const category = await Category.findByIdAndDelete(categoryId)
  if (!category) {
    const error = createHttpError(404, 'Category not found with the entered ID')
    throw error
  }
  return category
}
export const createNewCategory = async (newCategory: CategoryDocument) => {
  const { categoryName } = newCategory
  const categoryExist = await Category.exists({ categoryName: categoryName })
  if (categoryExist) {
    const error = createHttpError(409, `Category already exists with this ${categoryName}`)
    throw error
  }
  const category = await Category.create({
    ...newCategory,
  })
  return category
}
