import { Product } from '../models/productModel'
import { ProductDocument } from '../types/types'
import ApiError from '../errors/ApiError'
import { Category } from '../models/categoryModel'

// @service:- Find All Products
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

  const foundCategory = await Category.find({
    categoryName: { $regex: `${category}`, $options: 'i' },
  })

  const products = await Product.find()
  .populate('reviews')
    .skip(skip)
    .limit(limit)
    .sort(sortQuery)
    .find(
      searchText
        ? {
            $or: [
              { productName: { $regex: searchText, $options: 'i' } },
              { productDescription: { $regex: searchText, $options: 'i' } },
            ],
          }
        : {}
    )
    .find(category ? { category: { $in: foundCategory } } : {})

  return { products, totalPages, currentPage: pageNumber }
}
// @service:- Find a Product
export const findProduct = async (productId: string) => {
  const product = await Product.findById(productId)
  if (!product) {
    throw ApiError.notFound('Product not found with the entered ID')
  }
  return product
}
// @service:- Find Highest Sold Products
export const findHighestSoldProducts = async (limit = 8) => {
  const highestSoldProducts = await Product.find()
    .sort({ itemsSold: -1 })
    .limit(limit)
    .populate('category')

  return { highestSoldProducts }
}
// @service:- Remove a Product
export const removeProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id)
  return product
}
// @service:- Update a Product
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
// @service:- Create a Product
export const createNewProduct = async (newProduct: ProductDocument) => {
  const product = await Product.create(newProduct)
  return product
}
