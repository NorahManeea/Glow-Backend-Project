import { Product } from '../models/productModel'
import createHttpError from 'http-errors'
import { ProductDocument } from '../types/types'
import slugify from 'slugify'

export const findAllProducts = async (
  pageNumber = 1,
  limit = 8,
  sortBy = '',
  searchText = '',
  category = ''
) => {
  const productCount = await Product.countDocuments()
  const totalPages = Math.ceil(productCount / limit)

  if (pageNumber > totalPages) {
    pageNumber = totalPages
  }
  const skip = (pageNumber - 1) * limit
  let sortQuery = {}

  if (sortBy === 'newest') {
    sortQuery = { createdAt: -1 }
  } else if (sortBy === 'lowestPrice') {
    sortQuery = { productPrice: 1 }
  } else if (sortBy === 'highestPrice') {
    sortQuery = { productPrice: -1 }
  }
  const products = await Product.find()
    .populate('category')
    .skip(skip)
    .limit(limit)
    .sort(sortQuery)
    .find(searchText ? { productName: { $regex: searchText, $options: 'i' } } : {})
    .find(category ? { category: { $in: [category] } } : {})

  return { products, totalPages, currentPage: pageNumber }
}

export const findProduct = async (productId: string) => {
  const product = await Product.findById(productId)
  if (!product) {
    const error = createHttpError(404, 'Product not found with the entered ID')
    throw error
  }
  return product
}

export const removeProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id)
  if (!product) {
    const error = createHttpError(404, 'Product not found with the entered ID')
    throw error
  }
  return product
}

export const updateProduct = async (productId: string, updatedProduct: ProductDocument) => {
  const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true })
  if (!product) {
    const error = createHttpError(404, 'Product not found with the entered ID')
    throw error
  }
  return product
}

export const createNewProduct = async (newProduct: ProductDocument) => {
  const { productName } = newProduct
  const productExist = await Product.exists({ productName: productName })
  if (productExist) {
    const error = createHttpError(
      409,
      `Product already exists with this product name ${productName}`
    )
    throw error
  }
  const product = await Product.create({
    ...newProduct,
    slug: slugify(productName),
  })
  return product
}
