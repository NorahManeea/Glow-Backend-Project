import { Product } from '../models/productModel'
import { ProductDocument } from '../types/types'
import ApiError from '../errors/ApiError'
import { Category } from '../models/categoryModel'
import { calculatePagination } from '../utils/paginationUtils'
import { findBySearchQuery } from '../utils/searchUtils'

//** Service:- Find All Products */
export const findAllProducts = async (
  pageNumber = 1,
  limit = 8,
  sortBy = '',
  searchText = '',
  category = ''
) => {
  const productCount = await Product.countDocuments()
  const { currentPage, skip, totalPages } = calculatePagination(productCount, pageNumber, limit)

  let sortQuery = {}
  if (sortBy === 'newest') {
    sortQuery = { createdAt: -1 }
  } else if (sortBy === 'lowestPrice') {
    sortQuery = { productPrice: 1 }
  } else if (sortBy === 'highestPrice') {
    sortQuery = { productPrice: -1 }
  }

  const foundCategory = await Category.find({
    categoryName: { $regex: `${category}`, $options: 'i' },
  })

  const products = await Product.find()
    .populate('category')
    .skip(skip)
    .limit(limit)
    .sort(sortQuery)
    .find(findBySearchQuery(searchText, 'productName'))
    .find(findBySearchQuery(searchText, 'productDescription'))
    .find(category ? { category: { $in: foundCategory } } : {})

  if (products.length == 0) {
    throw ApiError.notFound('There are no orders')
  }

  return { products, totalPages, currentPage }
}

//** Service:- Find Single Product */
export const findProduct = async (productId: string) => {
  const product = await Product.findById(productId)
  if (!product) {
    throw ApiError.notFound(`Product not found with ID: ${productId}`)
  }

  return product
}

//** Service:- Find Highest Sold Products */
export const findHighestSoldProducts = async (limit = 8) => {
  const highestSoldProducts = await Product.find()
    .sort({ itemsSold: -1 })
    .limit(limit)
    .populate('category')

  return { highestSoldProducts }
}

//** Service:- Remove a Product */
export const removeProduct = async (productId: string) => {
  const product = await Product.findByIdAndDelete(productId)

  return product
}

//** Service:- Update a Product */
export const updateProduct = async (
  productId: string,
  updatedProduct: ProductDocument,
  productImage: string | undefined
) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { ...updatedProduct, productImage: productImage },
    { new: true }
  )
  if (!product) {
    throw ApiError.notFound('Product not found with the entered ID')
  }

  return product
}

//** Service:- Create a Product */
export const createNewProduct = async (newProduct: ProductDocument) => {
  const product = await Product.create(newProduct)

  return product
}
